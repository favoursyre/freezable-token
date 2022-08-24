const { expect } = require('chai')
const { ethers } = require('hardhat')

describe("FreezeToken", () => {
    beforeEach(async () => {
        [owner, signer2] = await ethers.getSigners()

        FreezeToken = await ethers.getContractFactory("FreezeToken", owner)
        _freezeToken = await FreezeToken.deploy()
    })

    describe("transfer", () => {
        it("transfers tokens when unpaused", async () => {
            let ownerBalance;
            let signer2Balance;

            ownerBalance = await _freezeToken.balanceOf(owner.address)
            signer2Balance = await _freezeToken.balanceOf(signer2.address)
            expect(ownerBalance).to.equal(ethers.utils.parseEther("1000"))
            expect(signer2Balance).to.equal(ethers.utils.parseEther("0"))

            await _freezeToken.connect(owner).transfer(signer2.address, ethers.utils.parseEther("250"))

            ownerBalance = await _freezeToken.balanceOf(owner.address)
            signer2Balance = await _freezeToken.balanceOf(signer2.address)
            expect(ownerBalance).to.equal(ethers.utils.parseEther("750"))
            expect(signer2Balance).to.equal(ethers.utils.parseEther("250"))
        })

        it("reverts transfers when paused", async () => {
            let ownerBalance;
            let signer2Balance;

            ownerBalance = await _freezeToken.balanceOf(owner.address)
            signer2Balance = await _freezeToken.balanceOf(signer2.address)
            expect(ownerBalance).to.equal(ethers.utils.parseEther("1000"))
            expect(signer2Balance).to.equal(ethers.utils.parseEther("0"))

            await _freezeToken.connect(owner).pause()

            expect(_freezeToken.connect(owner).transfer(
                signer2.address, ethers.utils.parseEther("250")
            )).to.be.revertedWith("Pausable: paused")

            ownerBalance = await _freezeToken.balanceOf(owner.address)
            signer2Balance = await _freezeToken.balanceOf(signer2.address)
            expect(ownerBalance).to.equal(ethers.utils.parseEther("750"))
            expect(signer2Balance).to.equal(ethers.utils.parseEther("250"))
        })
    })
})