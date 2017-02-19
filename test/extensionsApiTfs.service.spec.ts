import {ExtensionsApiTfsService} from "../src/app/extensionsApiTfs.service";
import {PullRequestAsyncStatus} from "../src/app/model";
import {TestUtils} from "./testHelpers";

describe("ExtensionsApiTfsService", () => {

    let zoneMock: any = {
        run: (fn: () => any): any => { fn(); }
    };

    let userContext: UserContext = {
        email: "test@test.com",
        id: "Microsoft.TeamFoundation.Identity.testuser",
        limitedAccess: false,
        name: "test user",
        uniqueName: "testuser1"
    };

    let membersMap = {
        "Microsoft.TeamFoundation.Identity.testuser": ["Microsoft.TeamFoundation.Identity.group1", "Microsoft.TeamFoundation.Identity.group2", "Microsoft.TeamFoundation.Identity.groupOfGroups"],
        "Microsoft.TeamFoundation.Identity.group1": [],
        "Microsoft.TeamFoundation.Identity.group2": [],
        "Microsoft.TeamFoundation.Identity.groupOfGroups": ["Microsoft.TeamFoundation.Identity.group3", "Microsoft.TeamFoundation.Identity.group4", "SomeOtherGroup"]
    };

    let repos: GitRepository[] = [
        TestUtils.createRepository("repo1"),
        TestUtils.createRepository("repo2"),
        TestUtils.createRepository("repo3"),
        TestUtils.createRepository("repo4"),
        TestUtils.createRepository("repo5")
    ];

    let prMap = {
        "repo1": [createPR(1), createPR(2), createPR(3), createPR(4)],
        "repo3": [createPR(5), createPR(6)]
    };

    let projectName = "Test Project";
    let gitClient: GitClient = null;
    let identitiesClient: IdentitiesClient = null;

    function createPR(id: number): GitPullRequest {
        return TestUtils.createPullRequest({
            id: id,
            mergeStatus: PullRequestAsyncStatus.Succeeded,
            reviewers: []
        });
    }

    function createIdentity(memberId: string): Identity {
        return {
            customDisplayName: `test${memberId}`,
            descriptor: null,
            id: memberId,
            isActive: true,
            isContainer: false,
            masterId: "123",
            memberIds: [],
            memberOf: [],
            members: [],
            metaTypeId: null,
            properties: null,
            providerDisplayName: "test",
            resourceVersion: 1,
            uniqueUserId: 1
        };
    }

    function createSubject(isHosted: boolean): ExtensionsApiTfsService {
        return new ExtensionsApiTfsService(gitClient, identitiesClient, isHosted, projectName, userContext, zoneMock);
    }

    beforeEach(() => {
        identitiesClient = {
            readIdentity: (identityId: string, queryMembership?: QueryMembership, properties?: string): Promise<Identity> => {
                return Promise.resolve(createIdentity(identityId));
            },
            readMembersOf: (memberId: string, queryMembership?: QueryMembership): Promise<string[]> => {
                let members = membersMap[memberId];
                if (members == null) {
                    members = [];
                }
                return Promise.resolve(members);
            }
        };

        gitClient = {
            getPullRequests: (repositoryId: string, searchCriteria: GitPullRequestSearchCriteria, project?: string, maxCommentLength?: number, skip?: number, top?: number): Promise<GitPullRequest[]> => {
                let prs = prMap[repositoryId];
                if (prs == null) {
                    prs = [];
                }
                return Promise.resolve(prs);
            },
            getRepositories: (project?: string, includeLinks?: boolean): Promise<GitRepository[]> => {
                return Promise.resolve(repos);
            }
        };
    });

    it("Doesn't call API if hosted when getCurrentUser is called", async (done) => {
        let subject = createSubject(true);
        spyOn(identitiesClient, "readIdentity");
        spyOn(identitiesClient, "readMembersOf");

        await subject.getCurrentUser();
        expect(identitiesClient.readIdentity).toHaveBeenCalledTimes(0);
        expect(identitiesClient.readMembersOf).toHaveBeenCalledTimes(0);
        done();
    });

    it("Returns user details from UserContext if hosted with getCurrentUser", async (done) => {
        let subject = createSubject(true);
        let user = await subject.getCurrentUser();
        expect(user).not.toBeNull();
        expect(user.id).toEqual(userContext.id);
        expect(user.displayName).toEqual(userContext.name);
        expect(user.uniqueName).toEqual(userContext.uniqueName);
        expect(user.memberOf.length).toEqual(0);
        done();
    });

    it("Resolves a user's membersOf if not hosted", async (done) => {
        let subject = createSubject(false);
        let user = await subject.getCurrentUser();
        expect(user).not.toBeNull();
        expect(user.memberOf).toBeDefined();
        expect(user.memberOf.length).toEqual(5);
        expect(user.memberOf.filter((x) => x.id === "Microsoft.TeamFoundation.Identity.group1").length).toEqual(1);
        expect(user.memberOf.filter((x) => x.id === "Microsoft.TeamFoundation.Identity.group2").length).toEqual(1);
        expect(user.memberOf.filter((x) => x.id === "Microsoft.TeamFoundation.Identity.groupOfGroups").length).toEqual(1);
        expect(user.memberOf.filter((x) => x.id === "Microsoft.TeamFoundation.Identity.group3").length).toEqual(1);
        expect(user.memberOf.filter((x) => x.id === "Microsoft.TeamFoundation.Identity.group4").length).toEqual(1);
        expect(user.memberOf.filter((x) => x.id === "SomeOtherGroup").length).toEqual(0);
        done();
    });

    it("Returns all repositories", async (done) => {
        let subject = createSubject(true);

        let repositories = await subject.getRepositories();

        expect(repositories).toEqual(repos);

        done();
    });

    it("Returns all PRs for a repository", async (done) => {
        let subject = createSubject(true);

        let repositories = await subject.getPullRequests(repos[0]);

        expect(repositories).toEqual(prMap[repos[0].id]);

        repositories = await subject.getPullRequests(repos[2]);

        expect(repositories).toEqual(prMap[repos[2].id]);

        done();
    });

    it("Returns an empty list if repo has no PRs", async (done) => {
        let subject = createSubject(true);

        let repositories = await subject.getPullRequests(repos[3]);

        expect(repositories.length).toEqual(0);

        done();
    });
});
