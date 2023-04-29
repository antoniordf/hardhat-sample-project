import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { assert, expect } from "chai";

describe.only("Simple storage unit tests", function () {
  // Fixtures
  async function deploySimpleStorageFixture() {
    const _message = "Something else";

    const [owner, otherAccount] = await ethers.getSigners();

    const simpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    );
    const simpleStorage = await simpleStorageFactory
      .connect(owner)
      .deploy(_message);
    return { simpleStorage, _message, owner, otherAccount };
  }

  it("Should test deployment stuff", async function () {
    const { simpleStorage, _message, owner } = await loadFixture(
      deploySimpleStorageFixture
    );
    const message = await simpleStorage.message();
    assert(message === _message, "Messages are not the same.");

    const currentOwner = await simpleStorage.owner();
    assert(currentOwner === owner.address, "Owner was not set properly");
  });

  describe("#setMessage", async function () {
    it("Should be called only by an owner", async function () {
      const { simpleStorage, otherAccount } = await loadFixture(
        deploySimpleStorageFixture
      );
      await expect(
        simpleStorage.connect(otherAccount).setMessage("Hello world")
      ).to.be.revertedWith("Only owner can call this method");
    });

    it("Should set new message", async function () {
      const { simpleStorage, owner } = await loadFixture(
        deploySimpleStorageFixture
      );
      const newMessage = "Chainlink Spring Hackathon";
      await simpleStorage.connect(owner).setMessage(newMessage);
      const actualMessage = await simpleStorage.message();
      assert(actualMessage === newMessage, "Message not set");
    });

    it("Should emit a NewMessage event", async function () {
      const { simpleStorage, owner } = await loadFixture(
        deploySimpleStorageFixture
      );
      const newMessage = "This is fun";
      await expect(simpleStorage.connect(owner).setMessage(newMessage))
        .to.emit(simpleStorage, "NewMessage")
        .withArgs(newMessage);
    });
  });
});
