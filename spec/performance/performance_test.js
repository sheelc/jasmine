describe("performance", function() {
  for (var i = 0; i < 20000; i++) {
    it("should pass", function() {
      expect(true).toBe(true);
    });
    it("should fail", function() {
      expect(true).toBe(false);
    });
  }
});
