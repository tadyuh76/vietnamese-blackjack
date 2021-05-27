const defaultCards = ["A", "K", "2", "3"].flatMap(i => [i,i,i,i]);

//const defaultCards = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'].flatMap(i => [i,i,i,i]);
const cardsValue = {
          'A': 11,
          '2': 2, '3': 3,
          '4': 4, '5': 5,
          '6': 6, '7': 7,
          '8': 8, '9': 9,
          '10': 10, 'J': 10,
          'Q': 10, 'K': 10,
      };
       
// Âm thanh
const hitSound = new Audio('assets/sounds/swish.m4a')
      winSound = new Audio('assets/sounds/win.mp3')
      loseSound = new Audio('assets/sounds/lose.mp3');
// Bài của từng player đang có
let yourCards = []
    botCards = [];
    
// *Database*
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
     
     
// Xáo bài
let cards;
function shuffleCards(defaultCards) {
    cards = [...defaultCards];
    cards.sort(() => Math.random() -0.5);
}
shuffleCards(defaultCards);

function gameStart(player) {
    // Rút 2 lá
    gameHit(player);
    gameHit(player);
    
    // Đổi nút Bốc thành Rút
    startBtn.style.display = 'none';
    hitBtn.style.display = 'inline-block';
}
    
function gameHit(player) {
    // Khi player/bot < 21 điểm hoặc không trúng TH đặc biệt mới được rút
    if (player.score < 21 && updateScore(player) != "NL" && updateScore(player) != "XB" && updateScore(player) != "XD" && stand != true) {
        createCard(player);
        updateScore(player);
        hitSound.play();
    }
}

function createCard(player) {
    // Bốc lá cuối cùng
    let randomCard = cards.pop();
    player.cards.push(randomCard);
        
    cardImg = document.createElement('img');
    cardImg.src = `assets/img/${randomCard}.png`;
    document.querySelector(player.box).append(cardImg);
        
    // Đổi giá trị của A từ 11 -> 10 hoặc 1 cho phù hợp
    aceValue(player, randomCard);
        
    player.score = 0; // reset lại điểm tránh tính sai
    // Chạy lại vòng đếm điểm để đổi số điểm khi Ace đổi 
    for (let i = 0; i < player.cards.length; i++) {
        player.score += cardsValue[player.cards[i]]
    }
}

function aceValue(player, card) {
    if (player.score + cardsValue[card] > 21) {cardsValue['A'] = 10;}
    if (player.score + cardsValue[card] > 21 || updateScore(player) === "NL") {cardsValue['A'] = 1;}
}

function updateScore(player) {
    // Xì Bàn
    if (JSON.stringify(player.cards) == JSON.stringify(["A", "A"])) {
        document.querySelector(player.scoreSpan).textContent = 'XÌ BÀN!';
        document.querySelector(player.scoreSpan).style.color = 'yellow';
        return "XB";
    }
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
    if (you.score < 16 && you.cards.length != 5) {
        result.textContent = "Bài Non!";
        result.style.color = "red";
        // Dừng hàm để không cho máy bốc bài
        return 0;
    }
    // Máy bốc 2 lá bài
    gameStart(bot);
    if (updateScore(you) == "XB") {
      decideWinner();
      return 0;
    }

    
    // Máy luôn rút khi dưới 16 nút
    while (bot.score < 16) {
        gameHit(bot);
    }
  
    // Khi máy >= 16 nút thì 33.33333% rút
    if (bot.score <= 18 && Math.floor(Math.random()*3) === 0) {
        gameHit(bot);
    }
    
    // đánh dấu đã chạy xong func
    stand = true;
    
    decideWinner();
}

function decideWinner() {
  if (you.score <= 21 && bot.score <= 21) {
    if (you.score === bot.score) {
      result.textContent = "Hòa";
    }
    else if (updateScore(bot) != "NL" && ((updateScore(you) === "XD" && updateScore(bot) != "XB") || updateScore(you) === "XB" || (updateScore(you) === "NL" && (updateScore(bot) != "XD" || updateScore(bot) != "XB")) || you.score > bot.score))  {
      result.textContent = "Bạn Thắng 🎉";
    }
    else {result.textContent = "Bạn Thua 😶";}
  }
  
  // Nếu cả hai cùng quắc
  else if (you.score > 21 && bot.score > 21) { result.textContent = "Quắc Hòa 🥴"; }
  // Nếu người quắc => máy win
  else if (bot.score > 21) { result.textContent = "Bạn Thắng 🎉"; }
  // Máy quắc
  else { result.textContent = "Bạn Thua 😶"; }

  gameSoundColor();
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

function gameSoundColor() {
  if (result.textContent === "Bạn Thắng 🎉") {
    result.style.color = "green";
    winSound.play();
  }
  else if (result.textContent === "Bạn Thua 😶") {
    result.style.color = "red";
    loseSound.play();
  } else {
    result.style.color = "brown";
  }
}