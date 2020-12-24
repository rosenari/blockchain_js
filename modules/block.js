import fs from "fs";
import crypto from "crypto";

const blockPath = "./blocks/"

const salt = "ssafy";

class Block {
    constructor(data, prevHash, nonce, version) {
        this.timestamp = new Date();
        this.data = data;
        this.nonce = nonce;
        this.prevHash = prevHash;
        this.version = version;
    }

    //넌스값 변경
    setNonce(nonce) {
        this.timestamp = new Date();
        this.nonce = nonce;
    }

    //현재블록의 해시값 계산
    getHash() {
        return crypto.createHmac('sha256', salt).update(JSON.stringify(this.toJSON())).digest('hex');
    }

    toJSON() {
        return {
            timestamp: this.timestamp,
            data: this.data,
            nonce: this.nonce,
            prevHash: this.prevHash,
            version: this.version
        }
    }
}

const blockModule = {};

blockModule.isBlock = () => {
    if (fs.existsSync(blockPath + "1.block")) {
        return true;
    }

    return false;
}

blockModule.createGenesisBlock = () => {
    let self = blockModule;
    self.commitBlock(self.createBlock(1, 0, 0), 1);
}

blockModule.createBlock = (version, prevHash, nonce) => {
    let block = new Block(version + " block", prevHash, nonce, version);
    return block;
}

blockModule.commitBlock = (block) => {
    fs.writeFileSync(blockPath + block.version + ".block", JSON.stringify(block.toJSON()));
    fs.writeFileSync(blockPath + "version", block.version);

    console.log("");
    console.log("Create " + block.version + "th Block !");
    console.log("block data:" + JSON.stringify(block.toJSON()));
    console.log("Hash:" + block.getHash());
}

blockModule.getCurrentVersion = () => {
    let version = JSON.parse(fs.readFileSync(blockPath + "version"));
    return version;
}

blockModule.mining = (level) => {
    let self = blockModule;
    let version = self.getCurrentVersion();

    let nonce = 0;

    let prevInfo = JSON.parse(fs.readFileSync(blockPath + version + ".block"));

    let prevBlock = new Block(prevInfo.data, prevInfo.prevHash, prevInfo.nonce, prevInfo.version);
    prevBlock.timestamp = prevInfo.timestamp;

    //console.log(prevBlock.getHash());

    version += 1;
    let block = new Block(version + "th block", prevBlock.getHash(), nonce, version);
    while (check(block.getHash()) < level) {
        //console.log(block.getHash());
        nonce++;
        block = new Block(version + "th block", prevBlock.getHash(), nonce, version);
    }

    self.commitBlock(block);

}

let check = (hash) => {
    let cnt = 0;
    let arr = Array.from(hash);
    for (let i in arr) {
        if (arr[i] == "0") {
            cnt++;
        } else {
            break;
        }
    }
    return cnt;
}


export default blockModule;