import { handleSubmit } from "../index.js"

describe("Testing the index functionality", () => {
    test("Testing the exports exist", () => {
        expect(handleSubmit).toBeDefined();
    })
});