//const defaultCards = ["A","K","2"].flatMap(i=> [i,i,i,i]);
const defaultCards = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'].flatMap(i => [i,i,i,i]);
// Xáo bài
let cards;
function shuffleCards(defaultCards) {
    cards = [...defaultCards];
    cards.sort(() => Math.random() -0.5);
}
shuffleCards(defaultCards);

const cardsValue = {
          'A': 11,
          '2': 2, '3': 3,
          '4': 4, '5': 5,
          '6': 6, '7': 7,
          '8': 8, '9': 9,
          '10': 10, 'J': 10,
          'Q': 10, 'K': 10,
      };
      
let yourCards = []
    botCards = [];
    
let game = {
    'you': {'box': '.your-box', 'score': 0, 'scoreSpan': '#your-score', 'cards': yourCards},
    'bot': {'box': '.bot-box', 'score': 0, 'scoreSpan': '#bot-score', 'cards': botCards},
};

let you = game.you
    bot = game.bot
    yourBox = document.querySelector(you.box)
    botBox = document.querySelector(bot.box)
    startBtn = document.querySelector('#start')
    hitBtn = document.querySelector('#hit')
    result = document.querySelector('#result');
    
function gameStart(player) {
    // Rút 2 lá
    gameHit(player);
    gameHit(player);
    startBtn.style.display = 'none';
    hitBtn.style.display = 'inline-block';
    
}
    
function gameHit(player) {
    // Khi player/bot 
    if (player.score < 21 && updateScore(player) != "NL" && updateScore(player) != "XB" && updateScore(player) != "XD" && stand != true) {
        createCard(player);
        updateScore(player);
    }

}

function createCard(player) {

    let randomCard = cards.pop();
    player.cards.push(randomCard);
        
    cardImg = document.createElement('img');
    cardImg.src = `assets/img/${randomCard}.png`;
    document.querySelector(player.box).append(cardImg);
        
    // Đổi giá trị của A từ 11 -> 10 hoặc 1 cho phù hợp
    aceValue(player, randomCard);
        
    // Chạy lại vòng đếm điểm để đổi số điểm khi Ace đổi 
    player.score = 0; // reset lại điểm tránh tính sai
        
    for (let i = 0; i < player.cards.length; i++) {
        player.score += cardsValue[player.cards[i]]
    }

}

function aceValue(player, card) {
    if (player.score + cardsValue[card] > 21) {
        cardsValue['A'] = 10;
    } if (player.score + cardsValue[card] > 21) {
        cardsValue['A'] = 1;
    }
}



function updateScore(player) {
    // Xì Bàn
    if (JSON.stringify(player.cards) == JSON.stringify(["A", "A"])) {
        document.querySelector(player.scoreSpan).textContent = 'XÌ BÀN!';
        document.querySelector(player.scoreSpan).style.color = 'yellow';
        return "XB";     }
    // Xì Dách
    else if ((player.cards.includes("A") && player.cards.length === 2) && (player.cards.includes("K") || player.cards.includes("Q") || player.cards.includes("J") || player.cards.includes("10"))) {
        document.querySelector(player.scoreSpan).textContent = 'XÌ DÁCH!';
        document.querySelector(player.scoreSpan).style.color = 'yellow';
        return "XD";
    }
    // Ngũ Linh
    else if (player.cards.length === 5 && player.score <= 21) {
        document.querySelector(player.scoreSpan).textContent = 'NGŨ LINH!';
        document.querySelector(player.scoreSpan).style.color = 'yellow';
        return "NL";
    }
    // Lố 28
    else if (player.score >= 28) {
        document.querySelector(player.scoreSpan).textContent = 'CÒN CÁI NỊT';
        document.querySelector(player.scoreSpan).style.color = 'crimson';
    }
    // quắc
    else if (player.score > 21) {
        document.querySelector(player.scoreSpan).textContent = 'QUẮC';
        document.querySelector(player.scoreSpan).style.color = 'red';
    }
    // bình thường
    else {
        document.querySelector(player.scoreSpan).textContent = player.score;

    }
}

let stand;
function gameStand() {
    if (you.score < 16) {
        result.textContent = "Bài Non!";
        result.style.color = "red";
        return 0; // Dừng hàm để không cho máy bốc bài
    }

    gameStart(bot);
    
    // Máy luôn rút khi dưới 16 nút
    while (bot.score < 16) {
        gameHit(bot);
    }
  
    // Khi máy >= 16 nút thì 50% rút
    if (bot.score <= 18 && Math.floor(Math.random()*3) === 0) {
        gameHit(bot);
    }
    stand = true;
    
    decideWinner();
}

function decideWinner() {
    if (you.score <= 21 && bot.score <= 21) {
        if (you.score === bot.score) {
            result.textContent = "Hòa";
            result.style.color = "orange";
        }
        else if (you.score > bot.score || updateScore(you) === "XD" || updateScore(you) === "XB" || updateScore(you) === "NL") {
            result.textContent = "Bạn Thắng 🎉";
            result.style.color = "green";
        }
        else {
            result.textContent = "Bạn Thua 😶";
            result.style.color = "red";
        }
    }
    // Nếu cả hai cùng quắc
    else if (you.score > 21 && bot.score > 21) {result.textContent = "Quắc Hòa 🥴"; result.style.color = "brown";}
    // Nếu người quắc => máy win
    else if (bot.score > 21) {result.textContent = "Bạn Thắng 🎉"; result.style.color = "green";}
    // Máy quắc
    else {result.textContent = "Bạn Thua 😶"; result.style.color = "red";}

}

function gameReset() {
    if (stand != true) {
        alert("Bạn chưa chơi xong ván hiện tại!");
    }
    else {
        let cardImgs = document.querySelectorAll('.main img');
        for (let i = 0; i<cardImgs.length; i++) {
            cardImgs[i].remove();
        }
    
        you.cards = [];
        bot.cards = [];
        cardsValue['A'] = 11;
        shuffleCards (defaultCards);
        stand = false;
    
        startBtn.style.display = 'inline-block';
        hitBtn.style.display = 'none';
    
        // Reset Score
        you.score = 0;
        bot.score = 0;
        document.querySelector(you.scoreSpan).textContent = 0;
        document.querySelector(bot.scoreSpan).textContent = 0;
        document.querySelector(you.scoreSpan).style.color = 'white';
        document.querySelector(bot.scoreSpan).style.color = 'white';
        result.textContent = "";
    }
}