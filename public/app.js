let genderBtn = document.querySelector(".gender-btn");
let speakLanguage =  document.querySelector(".speak");
let toggleBtns =  document.querySelectorAll(".on-off");
let langCards = document.querySelectorAll(".lang-area");
let frInput = document.querySelector(".fr");
let hiddenBtn = document.querySelector(".hidden-btn");
let submitBtn = document.querySelector(".sub");
let successMsg  = document.querySelector(".success");
let failMsg  = document.querySelector(".fail");
let counter = 0;
let counterFail = 0;

function showOrHiddeSuccessMsg(counter) {
  if(counter % 2 == 0) {
    successMsg.style.opacity = 0;
    successMsg.zIndex = -1;
    document.querySelector(".main-content").style.zIndex="1000";
  } else {
    successMsg.style.opacity = 1;
    successMsg.zIndex = 1000;
    failMsg.style.opacity = 0;
    failMsg.zIndex = -1;
    document.querySelector(".main-content").style.zIndex="-1";
  }
}

function showOrHiddeFailMsg(counterFail) {
  if(counterFail % 2 == 0) {
    failMsg.style.opacity = 0;
    failMsg.zIndex = -1;
    document.querySelector(".main-content").style.zIndex="1000";
  } else {
    failMsg.style.opacity = 1;
    failMsg.zIndex = 1000;
    successMsg.style.opacity = 0;
    successMsg.zIndex = -1;
    document.querySelector(".main-content").style.zIndex="-1";
  }
}

function deleteAllcolor(index) {
  if(index < 4){
    for(var i = 0; i < 4; i++) {
      langCards[i].style.color = "#BF9000";
    }
  } else {
    for(var i = 4; i < 8; i++) {
      langCards[i].style.color = "#BF9000";
    }
  } 
}


genderBtn.onclick = () => {
  if(frInput.checked == true){
    genderBtn.checked = true;
    genderBtn.value = "female";
  } else {
    if (genderBtn.checked == true) {
      genderBtn.value = "female";
      hiddenBtn.disabled = true;
    } else {
      genderBtn.value = "male";
      hiddenBtn.disabled = false;
    }
  }
}

toggleBtns.forEach( toggleBtn => {
  toggleBtn.onclick = () => {
    if(toggleBtn.checked == true) {
      let inputArea = toggleBtn.parentElement.parentElement.nextElementSibling;
      inputArea.style.opacity = "0.3";
      inputArea.children[1].disabled = true;
      inputArea.children[3].disabled = true;
      inputArea.children[1].required = true;
      inputArea.children[3].required = true;
    } else {
      let inputArea = toggleBtn.parentElement.parentElement.nextElementSibling;
      inputArea.style.opacity = "1";
      inputArea.children[1].disabled = false;
      inputArea.children[3].disabled = false;
      inputArea.children[1].required = false;
      inputArea.children[3].required = false;
    }
  }
})

langCards.forEach( (langCard , index) => {
  langCard.onclick = () => {
    langCard.children[0].children[2].checked = true;
    deleteAllcolor(index);
    langCard.style.color = "#7f6000";
    if (frInput.checked == true) {
      genderBtn.checked = true;
      genderBtn.value = "female";
      genderBtn.readOnly = true;
      document.querySelector(".gender-slider").style.cursor = "not-allowed";
      document.querySelector(".claimer").style.display = "block";
    } else {
      genderBtn.checked = false;
      genderBtn.disabled = false;
      genderBtn.readOnly = false;
      genderBtn.value = "male";
      document.querySelector(".gender-slider").style.cursor = "pointer";
      document.querySelector(".claimer").style.display = "none";
    }    
    /*else if (langCard.children[0].children[2].checked == true) {
      //langCard.parentElement.insertBefore(childNode[index], childNode[4]);
      let current = langCard.parentElement.children[index];
      let first = langCard.parentElement.children[0];
      langCard.parentElement.insertBefore( current, first);
      langCard.parentElement = langCard.parentElement;
    }*/
  }
})

submitBtn.onclick = () => {
  setTimeout(() => {
    var xhttp = new XMLHttpRequest();
    var url = window.location.protocol+ "//" + window.location.host + "/rest/cred";
    xhttp.onload = function () {
      if(this.status === 200) {
        var responseMsg = this.responseText;
        console.log(responseMsg);
        if (responseMsg == "TJBot is ready."){
          counter++ ;
          showOrHiddeSuccessMsg(counter);
        } else if (responseMsg == "Something went wrong."){
          counterFail++ ;
          showOrHiddeFailMsg(counterFail);
        }
      }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
  }, 20)
}

successMsg.onclick = () => {
  counter++;
  showOrHiddeSuccessMsg(counter);
}

failMsg.onclick = () => {
  counterFail++;
  showOrHiddeFailMsg(counterFail);
}


