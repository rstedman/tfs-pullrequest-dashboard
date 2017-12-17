import {LimitPipe} from "../src/app/limit.pipe";

describe("PullRequestSortPipe", () => {

    let subject: LimitPipe = null;

    beforeEach(() => {
        subject = new LimitPipe();
    });

    it("does nothing with an empty list", () => {
        const result = subject.transform([], 10);
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
    });

    it("returns the source list if limit is non-positive", () => {
        const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        const result = subject.transform(source, -1);

        expect(result).toBeDefined();
        expect(result).toEqual(source);
    });

    it("returns the source list if limit is greater than number of elements", () => {
        const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        const result = subject.transform(source, 20);

        expect(result).toBeDefined();
        expect(result).toEqual(source);
    });

    it("returns a the first N elements of a list", () => {
        const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        const result = subject.transform(source, 5);

        expect(result).toBeDefined();
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });
});
