import {ExtensionsApiTfsService} from "../src/app/extensionsApiTfs.service";
import {PullRequestAsyncStatus} from "../src/app/model";
import {TestUtils} from "./testHelpers";

describe("ExtensionsApiTfsService", () => {

    const zoneMock: any = {
        run: (fn: () => any): any => { fn(); }
    };

    const userContext: UserContext = {
        email: "test@test.com",
        id: "Microsoft.TeamFoundation.Identity.testuser",
        limitedAccess: false,
        name: "test user",
        uniqueName: "testuser1"
    };

    const membersMap = {
        "Microsoft.TeamFoundation.Identity.testuser": ["Microsoft.TeamFoundation.Identity.group1", "Microsoft.TeamFoundation.Identity.group2", "Microsoft.TeamFoundation.Identity.groupOfGroups"],
        "Microsoft.TeamFoundation.Identity.group1": [],
        "Microsoft.TeamFoundation.Identity.group2": [],
        "Microsoft.TeamFoundation.Identity.groupOfGroups": ["Microsoft.TeamFoundation.Identity.group3", "Microsoft.TeamFoundation.Identity.group4", "SomeOtherGroup"]
    };

    const repos: GitRepository[] = [
        TestUtils.createRepository("repo1", "P1"),
        TestUtils.createRepository("repo2", "P1"),
        TestUtils.createRepository("repo3", "P1"),
        TestUtils.createRepository("repo4", "P1"),
        TestUtils.createRepository("repo5", "P1"),
        TestUtils.createRepository("repo6", "P2")
    ];

    const prs = [createPR(1, "repo1", "P1"), createPR(2, "repo2", "P1"), createPR(3, "repo3", "P1"), createPR(4, "repo4", "P1"), createPR(5, "repo5", "P1"), createPR(6, "repo6", "P2")];

    const projectName = "P1";
    let gitClient: GitClient = null;
    let identitiesClient: IdentitiesClient = null;
    let coreClient: CoreHttpClient = null;

    function createPR(id: number, repo: string, project: string): GitPullRequest {
        return TestUtils.createPullRequest({
            id,
            mergeStatus: PullRequestAsyncStatus.Succeeded,
            reviewers: [],
            repo,
            project
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
        return new ExtensionsApiTfsService(gitClient, identitiesClient, coreClient, isHosted, projectName, userContext, zoneMock);
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
                const filtered = prs.filter((p) => p.repository.id === repositoryId);
                return Promise.resolve(filtered);
            },
            getRepositories: (project?: string, includeLinks?: boolean): Promise<GitRepository[]> => {
                if (project) {
                    const filtered = repos.filter((r) => r.project.name === project);
                    return Promise.resolve(filtered);
                }
                return Promise.resolve(repos);
            },
            getPullRequestsByProject: (project: string, searchCriteria: GitPullRequestSearchCriteria, maxCommentLength?: number, skip?: number, top?: number): Promise<GitPullRequest[]> => {
                if (project) {
                    const filtered = prs.filter((p) => p.repository.project.name === project);
                    return Promise.resolve(filtered);
                }
                return Promise.resolve(prs);
            }
        };

        coreClient = {
            getProjects: (stateFilter?: any, top?: number, skip?: number, continuationToken?: string): Promise<TeamProjectReference[]> => {
                const projects = [
                {
                    id: "1",
                    name: "P1"
                },
                {
                    id: "2",
                    name: "P2"
                }];

                return Promise.resolve(projects);
            }
        };
    });

    it("Doesn't call API if hosted when getCurrentUser is called", async (done) => {
        const subject = createSubject(true);
        spyOn(identitiesClient, "readIdentity");
        spyOn(identitiesClient, "readMembersOf");

        await subject.getCurrentUser();
        expect(identitiesClient.readIdentity).toHaveBeenCalledTimes(0);
        expect(identitiesClient.readMembersOf).toHaveBeenCalledTimes(0);
        done();
    });

    it("Returns user details from UserContext if hosted with getCurrentUser", async (done) => {
        const subject = createSubject(true);
        const user = await subject.getCurrentUser();
        expect(user).not.toBeNull();
        expect(user.id).toEqual(userContext.id);
        expect(user.displayName).toEqual(userContext.name);
        expect(user.uniqueName).toEqual(userContext.uniqueName);
        expect(user.memberOf.length).toEqual(0);
        done();
    });

    it("Resolves a user's membersOf if not hosted", async (done) => {
        const subject = createSubject(false);
        const user = await subject.getCurrentUser();
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

    it("Returns all repositories if allProjects true", async (done) => {
        const subject = createSubject(true);

        const repositories = await subject.getRepositories(true);

        expect(repositories).toEqual(repos);

        done();
    });

    it("Only returns repositories from current project if allProjects false", async (done) => {
        const subject = createSubject(true);

        const repositories = await subject.getRepositories(false);

        const expected = repos.filter((r) => r.project.name === projectName);

        expect(repositories).toEqual(expected);

        done();
    });

    it("Returns PRs from all projects if allProjects true", async (done) => {
        const subject = createSubject(true);

        const result = await subject.getPullRequests(true);

        expect(result).toEqual(prs);

        done();
    });

    it("Returns PRs from only the current project if allProjects false", async (done) => {
        const subject = createSubject(true);

        const expected = prs.filter((p) => p.repository.project.name === projectName);

        const result = await subject.getPullRequests(false);

        expect(result).toEqual(expected);

        done();
    });
});
