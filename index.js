import block from "./modules/block.js"

const level = 5;

const main = () => {

    //제네시스블록이 없다면 처음시작하는 것이므로 제네시스 블록생성
    if (!block.isBlock()) {
        console.log("제네시스 블록이 없습니다.");
        console.log("제네시스 블록을 생성합니다.");
        block.createGenesisBlock();
    }
    console.log("");
    console.log("");
    console.log("Start Mining :");
    console.log("Work Level : " + level);
    console.log("");
    //마이닝을 시작
    while (true) {
        block.mining(level);//난이도 5로 지정
    }

}

main();
