var tickSpeed = 1000;

// units are metric. food per person = 1kg, water = 2kg, land is in meters^2

var gameData = {
//job worker ratios
    farmer:0.5,
    lumberjack:0.1,
    waterGather:0.5,
    miner:0.1,
    explorer:0.1,
    builder:0.1,
//city description
    cityLevel:"Nomads",
    usedLand:0,
    availableLand:100,
//population
    population:1,
    maxPopulation:5,
    overPopulation:0,
//housing
    house1:0,
    house2:0,
//food
    food:0,
    maxFood:25,
    foodStorage1:0,
//wood
    wood:0,
    maxWood:25,
    woodStorage1:0,
    woodStorage2:0,
//water
    water:0,
    maxWater:1,
    waterStorage1:0,
}

//LOAD game save on page load
function load(){
//pull save data
    var loadGame = JSON.parse(localStorage.getItem("saveData"));
    gameData = loadGame;
//population
    if(typeof loadGame.population == "undefined") gameData.population ==1;
    document.getElementById('gameData.population').innerHTML = gameData.population;
    if(typeof loadGame.maxPopulation == "undefined") gameData.maxPopulation ==1;
    document.getElementById('gameData.maxPopulation').innerHTML = gameData.maxPopulation;
//land
    if(typeof loadGame.usedLand == "undefined") gameData.usedLand =0;
    document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
    if(typeof loadGame.availableLand == "undefined") gameData.availableLand =0;
    document.getElementById('gameData.availableLand').innerHTML = gameData.availableLand;
//food
    //granary
    if(typeof loadGame.food == "undefined") gameData.food =0;
    document.getElementById('gameData.food').innerHTML = Math.floor(gameData.food);
    document.getElementById('foodStorage1_LandCost').innerHTML = foodStorage1_LandCost;
    foodStorage1_WoodCost = Math.floor(foodStorage1_BaseWoodCost * Math.pow(1.1,gameData.foodStorage1));
    document.getElementById('foodStorage1_WoodCost').innerHTML = foodStorage1_WoodCost;
    document.getElementById('foodStorage1_Description').innerHTML = foodStorage1_Description;
    //farm
    if(typeof loadGame.maxFood == "undefined") gameData.maxFood=25;
    document.getElementById('gameData.maxFood').innerHTML = gameData.maxFood;
//food storage building
    if(typeof loadGame.foodStorage1 == "undefined") gameData.foodStorage1=0;
    document.getElementById('gameData.foodStorage1').innerHTML = gameData.foodStorage1;
//water
    if(typeof loadGame.water == "undefined") gameData.water =0;
    document.getElementById('gameData.water').innerHTML = Math.floor(gameData.water);
    if(typeof loadGame.maxWater == "undefined") gameData.maxWater=25;
    document.getElementById('gameData.maxWater').innerHTML = gameData.maxWater;
//water storage building
    if(typeof loadGame.waterStorage1 == "undefined") gameData.waterStorage1=0;
    document.getElementById('gameData.waterStorage1').innerHTML = gameData.waterStorage1;
//wood
    if(typeof loadGame.wood == "undefined") gameData.wood =0;
    document.getElementById('gameData.wood').innerHTML = Math.floor(gameData.wood);
    if(typeof loadGame.maxWood == "undefined") gameData.maxWood =25;
    document.getElementById('gameData.maxWood').innerHTML = gameData.maxWood;
//wood storage building
    if(typeof loadGame.woodStorage1 == "undefined") gameData.woodStorage1 =0;
    document.getElementById('gameData.woodStorage1').innerHTML = gameData.woodStorage1;
    if(typeof loadGame.woodStorage2 == "undefined") gameData.woodStorage2 =0;
    document.getElementById('gameData.woodStorage2').innerHTML = gameData.woodStorage2;
//housing
    //shelter
    if(typeof loadGame.house1 == "undefined") gameData.house1 =0;
    document.getElementById('gameData.house1').innerHTML = gameData.house1;
    document.getElementById('gameData.house1_LandCost').innerHTML = house1_LandCost;
    house1_WoodCost = Math.floor(house1_WoodBaseCost * Math.pow(1.04,gameData.house1));
    document.getElementById('gameData.house1_WoodCost').innerHTML = house1_WoodCost;
    document.getElementById('house1_Description').innerHTML = house1_Description;
    //house
    if(typeof loadGame.house2 == "undefined") gameData.house2 =0;
    document.getElementById('gameData.house2').innerHTML = gameData.house2;
    document.getElementById('gameData.house2_LandCost').innerHTML = house2_LandCost;
    house2_WoodCost = Math.floor(house2_WoodBaseCost * Math.pow(1.04,gameData.house2));
    document.getElementById('gameData.house2_WoodCost').innerHTML = house2_WoodCost;
    document.getElementById('house2_Description').innerHTML = house2_Description;
}
function save(){
    localStorage.setItem("saveData",JSON.stringify(gameData));
}

window.setInterval(function(){   save();},15000);

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function populationGrowth(number){
    if(gameData.population < gameData.maxPopulation && gameData.food > 0){
        gameData.population = gameData.population + number;
    }
    else if(gameData.population >= gameData.maxPopulation && gameData.food < 0){
        gameData.population = gameData.population - number;
    };
    city();
    gameData.overPopulation = Math.max(.05*gameData.maxPopulation,0);
    document.getElementById("gameData.population").innerHTML = gameData.population;
};
function city(){
    if (gameData.population >5){
        gameData.cityLevel = "Encampment";
        document.getElementById("cityLevel").innerHTML = gameData.cityLevel;
    };
};


var explorerSpeed = 1;
function exploreSpeed(){
    explorerSpeed = tickSpeed/(gameData.population*explorer);
    document.getElementById("explorerSpeed").innerHTML = explorerSpeed;
}
var builderSpeed = 1;
function buildSpeed(){
    builderSpeed = tickSpeed/(gameData.population*gameData.builder);
}

//FOOD
var foodps = 0;
var foodStorage1_BaseWoodCost = 25;
var foodStorage1_WoodCost = Math.floor(foodStorage1_BaseWoodCost * Math.pow(1.1,gameData.foodStorage1))
var foodStorage1_LandCost = 4;
var foodStorage1_Description = 'A palce to store 25 units of food';
function foodIncome(){
    if(gameData.food < gameData.maxFood){
    gameData.food = Math.max(Math.min(gameData.food + gameData.farmer*gameData.population, gameData.maxFood),0);
    };
    var foodDisplay = Math.round(gameData.food);
    foodps = gameData.farmer*gameData.population;
    document.getElementById("gameData.food").innerHTML = foodDisplay;
    document.getElementById("foodps").innerHTML = foodps;
};
//foodstorage1main
function foodStorage1_Buy(){
    if (gameData.wood >= foodStorage1_WoodCost && gameData.usedLand <= gameData.availableLand - foodStorage1_LandCost){
        gameData.foodStorage1 += 1;
        gameData.maxFood += 25;
        gameData.wood = gameData.wood - foodStorage1_WoodCost;
        gameData.usedLand = gameData.usedLand + foodStorage1_LandCost;
        document.getElementById('gameData.wood').innerHTML = gameData.wood;
        document.getElementById('gameData.maxFood').innerHTML = gameData.maxFood;
        document.getElementById('gameData.foodStorage1').innerHTML = gameData.foodStorage1;
        document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
        foodStorage1_WoodCost = Math.floor(foodStorage1_BaseWoodCost * Math.pow(1.1,gameData.foodStorage1));
        document.getElementById('foodStorage1_WoodCost').innerHTML = foodStorage1_WoodCost;
    };
};
function foodStorage1_Sell(){
    foodStorage1_WoodCost = Math.floor(foodStorage1_BaseWoodCost * Math.pow(1.1,gameData.foodStorage1));
    if (gameData.foodStorage1>0){
        gameData.foodStorage1 -= 1;
        gameData.maxFood -= 25;
        gameData.food = gameData.maxFood;
        gameData.wood = Math.min(gameData.wood+foodStorage1_WoodCost*.5,gameData.maxWood);
        gameData.usedLand = gameData.usedLand - foodStorage1_LandCost;
        document.getElementById('gameData.wood').innerHTML = gameData.wood;
        document.getElementById('gameData.maxFood').innerHTML = gameData.maxFood;
        document.getElementById('gameData.foodStorage1').innerHTML = gameData.foodStorage1;
        document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
        foodStorage1_WoodCost = Math.floor(foodStorage1_BaseWoodCost * Math.pow(1.1,gameData.foodStorage1));
        document.getElementById('foodStorage1_WoodCost').innerHTML = foodStorage1_WoodCost;
    };
};
function foodStorage1_Button(){
    //food1
    foodStorage1_WoodCost = Math.floor(foodStorage1_BaseWoodCost * Math.pow(1.1,gameData.foodStorage1));
    if(foodStorage1_WoodCost < gameData.wood){
        document.getElementById('foodStorage1_buyButton').className = 'buyButton';
    }
    else if(foodStorage1_WoodCost <= gameData.maxWood && foodStorage1_WoodCost > gameData.wood){
        document.getElementById('foodStorage1_buyButton').className = 'wipBuyButton';  
       }
    else if(foodStorage1_WoodCost > gameData.maxWood) {
        document.getElementById('foodStorage1_buyButton').className = 'inactiveBuyButton';
    };
}

//WOOD
var woodps = 0;
function woodIncome(){
    if(gameData.wood < gameData.maxWood){
    gameData.wood = Math.min(gameData.wood + gameData.lumberjack*gameData.population, gameData.maxWood);
    };
    var woodDisplay = Math.round(gameData.wood);
    woodps = Math.round((gameData.lumberjack*gameData.population * (1000/tickSpeed))*1000000)/1000000;
    document.getElementById("gameData.wood").innerHTML = woodDisplay;
    document.getElementById("woodps").innerHTML = woodps;
};
var woodStorage1_LandCost = 5;
//WOOD PILE
function woodStorage1_Buy(){
    if(gameData.usedLand <= gameData.availableLand-woodStorage1_LandCost){
        gameData.woodStorage1++;
        gameData.maxWood += 20;
        gameData.usedLand += woodStorage1_LandCost;
        document.getElementById('gameData.woodStorage1').innerHTML = gameData.woodStorage1;
        document.getElementById('gameData.maxWood').innerHTML = gameData.maxWood;
        document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
    }
}
function woodStorage1_Sell(){
    var woodStorage1_Cost = Math.floor(25 * Math.pow(1.1,gameData.woodStorage1));
    if (gameData.woodStorage1>0){
        gameData.woodStorage1--;
        gameData.maxWood -= 20;
        gameData.wood = gameData.maxWood;
        gameData.wood = Math.min(gameData.wood+woodStorage1_Cost*.5,gameData.maxWood);;
        gameData.usedLand = gameData.usedLand - woodStorage1_LandCost;
        document.getElementById('gameData.wood').innerHTML = gameData.wood;
        document.getElementById('gameData.maxWood').innerHTML = gameData.maxWood;
        document.getElementById('gameData.woodStorage1').innerHTML = gameData.woodStorage1;
        document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
        var nextWoodStorageCost = Math.floor(25 * Math.pow(1.1,gameData.woodStorage1));
        document.getElementById('woodStorageCost').innerHTML = nextWoodStorageCost;
    };
}
//BIGGER WOOD PILE
var woodStorage2_LandCost = 4;
function woodStorage2_Buy(){
    var woodStorage2_Cost = Math.floor(20 * Math.pow(1.1,gameData.woodStorage2));
    if (gameData.wood >= woodStorage2_Cost && gameData.usedLand <= gameData.availableLand - woodStorage2_LandCost){
        gameData.woodStorage2++;
        gameData.maxWood += 25;
        gameData.wood = gameData.wood - woodStorage2_Cost;
        gameData.usedLand = gameData.usedLand + woodStorage2_LandCost;
        document.getElementById('gameData.wood').innerHTML = gameData.wood;
        document.getElementById('gameData.maxWood').innerHTML = gameData.maxWood;
        document.getElementById('gameData.woodStorage2').innerHTML = gameData.woodStorage2;
        document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
        var woodStorage2_Cost = Math.floor(20 * Math.pow(1.1,gameData.woodStorage2));
        document.getElementById('woodStorage2_Cost').innerHTML = woodStorage2_Cost;
    };
};
function woodStorage2_Sell(){
    var woodStorage2_Cost = Math.floor(25 * Math.pow(1.1,gameData.woodStorage2));
    if (gameData.woodStorage2>0){
        gameData.woodStorage2--;
        gameData.maxWood -= 25;
        gameData.wood = gameData.maxWood;
        gameData.wood = Math.min(gameData.wood+woodStorage2_Cost*.5,gameData.maxWood);;
        gameData.usedLand = gameData.usedLand - woodStorage2_LandCost;
        document.getElementById('gameData.wood').innerHTML = gameData.wood;
        document.getElementById('gameData.maxWood').innerHTML = gameData.maxWood;
        document.getElementById('gameData.woodStorage2').innerHTML = gameData.woodStorage2;
        document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
        var woodStorage2_Cost = Math.floor(25 * Math.pow(1.1,gameData.woodStorage2));
        document.getElementById('woodStorage2_Cost').innerHTML = woodStorage2_Cost;
    };
}

//WATER
//initial water income is 2 units per person
//Water Building Cost Variables
var waterps = 0;
var waterStorage1_LandCost = 0;//4
var waterStorage1_WoodBaseCost =0;//20
//WATER INCOME
function waterIncome(){
    if(gameData.water < gameData.maxWater){
    gameData.water = Math.min(gameData.water + 4 * gameData.population * gameData.waterGather - 2*gameData.population, gameData.maxWater);
    };
    var waterDisplay = Math.round(gameData.water);
    waterps = (4 * gameData.population * gameData.waterGather - 2*gameData.population) * (1000/tickSpeed);
    document.getElementById("gameData.water").innerHTML = waterDisplay;
    document.getElementById("waterps").innerHTML = waterps;
};
//WATER STORAGE 1
function waterStorage1_Buy(){
    var waterStorageCost = Math.floor(waterStorage1_WoodBaseCost * Math.pow(1.1,gameData.waterStorage1));
    if (gameData.wood >= waterStorageCost && gameData.usedLand <= gameData.availableLand - waterStorage1_LandCost){
        gameData.waterStorage1++;
        gameData.maxWater += 25;
        gameData.wood = gameData.wood - waterStorageCost;
        gameData.usedLand = gameData.usedLand + waterStorage1_LandCost;
        document.getElementById('gameData.wood').innerHTML = gameData.wood;
        document.getElementById('gameData.maxWater').innerHTML = gameData.maxWater;
        document.getElementById('gameData.waterStorage1').innerHTML = gameData.waterStorage1;
        document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
        var nextwaterStorageCost = Math.floor(waterStorage1_WoodBaseCost * Math.pow(1.1,gameData.waterStorage1));
        document.getElementById('waterStorageCost').innerHTML = nextwaterStorageCost;
    };
};
function waterStorage1_Sell(){
    var waterStorageCost = Math.floor(25 * Math.pow(1.1,gameData.waterStorage1));
    if (gameData.waterStorage1>0){
        gameData.waterStorage1--;
        gameData.maxWater -= 25;
        gameData.water = gameData.maxWater;
        gameData.wood = Math.min(gameData.wood+waterStorageCost*.5,gameData.maxWood);;
        gameData.usedLand = gameData.usedLand - waterStorage1_LandCost;
        document.getElementById('gameData.wood').innerHTML = gameData.wood;
        document.getElementById('gameData.maxWater').innerHTML = gameData.maxWater;
        document.getElementById('gameData.waterStorage1').innerHTML = gameData.waterStorage1;
        document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
        var nextWaterStorageCost = Math.floor(25 * Math.pow(1.1,gameData.waterStorage1));
        document.getElementById('waterStorageCost').innerHTML = nextWaterStorageCost;
    };
};


//HOUSING
var house1_LandCost = 0;//5
var house1_WoodBaseCost = 5;//10
var house1_WoodCost = Math.floor(house1_WoodBaseCost * Math.pow(1.04,gameData.house1));
var house1_Description = 'A small shelter made of wood to protect from wind and rain.';
var house2_LandCost = 0;//20
var house2_WoodBaseCost =0;//10
var house2_WoodCost = Math.floor(house2_WoodBaseCost + Math.pow(1.04,gameData.house2));
var house2_Description = "A house large enough for five people";
function house1_Buy(){
    house1_WoodCost = Math.floor(house1_WoodBaseCost * Math.pow(1.04,gameData.house1));
    if(gameData.wood >= house1_WoodCost && gameData.usedLand <= gameData.availableLand - house1_LandCost){
        gameData.house1++;
        gameData.maxPopulation++;
        gameData.wood = Math.floor(gameData.wood - house1_WoodCost);
        gameData.usedLand = gameData.usedLand + house1_LandCost;
        document.getElementById('gameData.house1').innerHTML = gameData.house1;
        document.getElementById('gameData.wood').innerHTML = gameData.wood;
        document.getElementById("gameData.maxPopulation").innerHTML = gameData.maxPopulation;
        house1_WoodCost = Math.floor(house1_WoodBaseCost * Math.pow(1.04,gameData.house1));
        document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
        document.getElementById('gameData.house1_WoodCost').innerHTML = house1_WoodCost;
    }
}
function house1_Sell(){
    house1_WoodCost = Math.floor(house1_WoodBaseCost * Math.pow(1.04,gameData.house1));
    if (gameData.house1>0){
        gameData.house1--;
        gameData.maxPopulation--;
        gameData.population = gameData.maxPopulation;
        gameData.wood = Math.min(gameData.wood+house1_WoodCost*.5,gameData.maxWood);
        gameData.usedLand = gameData.usedLand - house1_LandCost;
        document.getElementById('gameData.wood').innerHTML = gameData.wood;
        document.getElementById('gameData.maxPopulation').innerHTML = gameData.maxPopulation;
        document.getElementById('gameData.house1').innerHTML = gameData.house1;
        document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
        house1_WoodCost = Math.floor(house1_WoodBaseCost * Math.pow(1.04,gameData.house1));
        document.getElementById('gameData.house1_WoodCost').innerHTML = house1_WoodCost;
    };
};
function house1_Button(){
    house1_WoodCost = Math.floor(house1_WoodBaseCost * Math.pow(1.04,gameData.house1));
    if(house1_WoodCost < gameData.wood){
        document.getElementById('house1_buyButton').className = 'buyButton';
    }
    else if(house1_WoodCost <= gameData.maxWood && house1_WoodCost > gameData.wood){
        document.getElementById('house1_buyButton').className = 'wipBuyButton';  
       }
    else if(house1_WoodCost > gameData.maxWood) {
        document.getElementById('house1_buyButton').className = 'inactiveBuyButton';
    };
};
function house2_Buy(){
    house2_Cost = Math.floor(house2_WoodBaseCost + Math.pow(1.04,gameData.house2));
    if(gameData.wood >= house2_Cost && gameData.usedLand <= gameData.availableLand - house2_LandCost){
        gameData.house2 += 1;
        gameData.maxPopulation += 5;
    	gameData.wood = gameData.wood - house2_Cost;
        gameData.usedLand = gameData.usedLand + house2_LandCost;
        document.getElementById('gameData.house2').innerHTML = gameData.house2;
        document.getElementById('gameData.wood').innerHTML = gameData.wood;
        document.getElementById("gameData.maxPopulation").innerHTML = gameData.maxPopulation;
        house2_Cost = Math.floor(house2_WoodBaseCost + Math.pow(1.04,gameData.house2));
        document.getElementById('gameData.house2_WoodCost').innerHTML = house2_WoodCost;
        document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
    };
};
function house2_Sell(){
    house2_Cost = Math.floor(house2_WoodBaseCost * Math.pow(1.04,gameData.house2));
    if (gameData.house2>0){
        gameData.house2--;
        gameData.maxPopulation--;
        gameData.population = gameData.maxPopulation;
        gameData.wood = Math.min(gameData.wood+house2_Cost*.5,gameData.maxWood);
        gameData.usedLand = gameData.usedLand - house2_LandCost;
        document.getElementById('gameData.wood').innerHTML = gameData.wood;
        document.getElementById('gameData.maxPopulation').innerHTML = gameData.maxPopulation;
        document.getElementById('gameData.house2').innerHTML = gameData.house2;
        document.getElementById('gameData.usedLand').innerHTML = gameData.usedLand;
        var house2_Cost = Math.floor(house2_WoodBaseCost * Math.pow(1.04,gameData.house2));
        document.getElementById('gameData.house2_WoodCost').innerHTML = house2_WoodCost && "   b";
    };
};

var usedLand = 0;
var availableLand = 100;
var maxLand = 1000;
async function clearLand(){
    if(gameData.availableLand < maxLand){
        await sleep(60*builderSpeed);
        gameData.availableLand += 50;
    }
    document.getElementById('gameData.availableLand').innerHTML = gameData.availableLand;
    document.getElementById('maxLand').innerHTML = maxLand;
};
function increaseLand(){

};

var research = 10;
var researchCap = 10;
var researchHouse = 0;
function researchIncome(){

}
function researchHouse1(){
    researchHouse = 1;
    document.getElementById('buyHouse').style.display = "none";
}

var time = 0;
var timeSeconds = 0;
var timeMinutes = 0;
var timeHours = 0;
function gameTime(){
    time++;
    timeSeconds = time%60;
    timeMinutes = Math.floor((time/60)%60);
    document.getElementById('timeSeconds').innerHTML = timeSeconds;
    document.getElementById('timeMinutes').innerHTML = timeMinutes;
}

window.setInterval(function(){
    populationGrowth(1);
	woodIncome();
    waterIncome();
    gameTime();
    buildSpeed();
    foodIncome();
    house1_Button();
    foodStorage1_Button();
}, tickSpeed);

//OPEN A TAB
function openTab(evt, tabName){
    var i, tabcontent, tabButton;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tabButton = document.getElementsByClassName("tabButton");
    for (i = 0; i < tabButton.length; i++) {
      tabButton[i].className = tabButton[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}




function clearSave(){
    localStorage.removeItem("saveData")
    var gameData = {
        //job worker ratios
            farmer:0.5,
            lumberjack:0.1,
            waterGather:0.5,
            miner:0.1,
            explorer:0.1,
            builder:0.1,
        //city description
            cityLevel:"Nomads",
            usedLand:0,
            availableLand:100,
        //population
            population:1,
            maxPopulation:5,
            overPopulation:0,
        //housing
            house1:0,
            house2:0,
        //food
            food:0,
            maxFood:25,
            foodStorage1:0,
        //wood
            wood:0,
            maxWood:25,
            woodStorage1:0,
            woodStorage2:0,
        //water
            water:0,
            maxWater:1,
            waterStorage1:0,
        }
    location.reload();
    localStorage.setItem("saveData",JSON.stringify(gameData));
    }