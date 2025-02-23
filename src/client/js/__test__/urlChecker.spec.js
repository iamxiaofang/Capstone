import { checkForUrl } from "../urlChecker.js"

describe("checkForUrl", () => {
    test("it should exist", () => {
        expect(checkForUrl).toBeDefined();
    })

    test("it should return true with good url ", () => {
        expect(checkForUrl('https://www.google.com')).toBe(true);
    })

    test("it should return true with url that has query parameters ", () => {
        expect(checkForUrl('https://www.google.com?q=cats')).toBe(true);
    })

    test("it should return false with bad url", () => {
        expect(checkForUrl('hello')).toBe(false);
    })
});