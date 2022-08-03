let chk = false;
let cnt = 1;

function game_team_setting_enter(e) {
    if (e.code == 'Enter') document.getElementById('game_team_setting').click();
}

function game_team_calc_enter(e) {
    if (e.code == 'Enter') document.getElementById('game_team_calc').click();
}

function game_team_reset() {
    chk = false;
    cnt = 1;
    document.getElementById('game_team_people').value = "";
    document.getElementById('game_team_in_wrap').innerHTML = "";
    document.getElementById('game_team_out_wrap').innerHTML = "";
    document.getElementById('game_team_copy_wrap').innerHTML = "";
    document.getElementById('game_team_setting').style.backgroundColor = "blanchedalmond";
}

function game_team_setting() {
    if (chk == true) return;

    let cnt = document.getElementById('game_team_people').value;
    let input_div = document.getElementById('game_team_in_wrap');
    if (cnt % 2 != 0) {
        alert("짝수만 가능해요");
        document.getElementById('game_team_people').value = "";
        return;
    }
    if (cnt > 10 || cnt < 0) {
        alert("10명 이하로 입력해주세요");
        document.getElementById('game_team_people').value = "";
        return;
    }

    for (let i = 1; i <= cnt; i++) {
        input_div.innerHTML += "<label>닉네임 </label>" +
            "<input id=\"game_team_in" + i + "_name\" class=\"game_team_in_name\" type=\"text\" onkeypress=\"game_team_calc_enter(event)\" />" +
            "<label style=\"font-size:large; margin-left:50px;\">점수 </label>" +
            "<input id=\"game_team_in" + i + "_score\" class=\"game_team_in_score\" type=\"number\" max=\"9999\" min=\"0\" onkeypress=\"game_team_calc_enter(event)\" /><br/>";
        if (i == cnt) {
            input_div.innerHTML += "<button class=\"game_team_btn\" id=\"game_team_calc\" onclick=\"game_team_calc();\">calc</button>";
        }
    }
    if (input_div.innerHTML != "") {
        chk = true;
        document.getElementById('game_team_setting').style.backgroundColor = "darksalmon";
    };
}

function game_team_calc() {
    let output_div = document.getElementById('game_team_out_wrap');
    let copy_div = document.getElementById('game_team_copy_wrap');
    let in_names = document.getElementsByClassName('game_team_in_name');
    let in_scores = document.getElementsByClassName('game_team_in_score');
    let team1_arr = new Array(); // team 1 구성원 html
    let team2_arr = new Array(); // team 2 구성원 html
    let team1_sum = 0; // team 1 합계 
    let team2_sum = 0; // team 2 합계
    let users = []; // 닉네임
    let scores = []; // 점수

    let out_html = "";
    output_div.innerHTML = "";
    copy_div.innerHTML = "";

    // Init
    for (let i = 0; i < in_scores.length; i++) {
        if(parseInt(in_scores[i].value) < 0 || parseInt(in_scores[i].value) > 9999){
            alert("점수는 0~9999점 사이로 입력해주세요");
            return;
        }
        if (in_scores[i].value == "") {
            alert("점수가 없어요!");
            return;
        } else {
            if (in_names[i].value == "") in_names[i].value = "unknown" + cnt++;
        }
        users[i] = in_names[i].value;
        scores[i] = parseInt(in_scores[i].value);
    }
    /************************************************************************************************/
    /* Calc                                                                                         */
    /* From         : Stack Overflow                                                                */
    /* Source Link  : https://stackoverflow.com/questions/70316157/algorithm-for-a-team-generator   */
    /* Thanks to    : https://stackoverflow.com/users/7696162/trentium                              */
    /************************************************************************************************/
    let players = [...scores];
    let playersTotal = players.reduce( ( sum, player ) => sum += player, 0 );

    let team1 = game_team_combinations( [], players, users.length/2 );
    
    let nextCombo;
    let minCombo, minDiff = Number.MAX_SAFE_INTEGER;
    
    do {
        nextCombo = team1.next().value;
        if ( nextCombo == null ) break;
        let team1Sum = nextCombo.reduce( ( sum, score ) => sum += score, 0 );
        let diff = Math.abs( ( playersTotal - team1Sum ) - team1Sum );
        if ( diff < minDiff ) {
            minCombo = nextCombo;
            minDiff = diff;
        }
    } while ( true );
     
    // HTML Setting
    out_html += "<table class=\"game_team_table\"><thead><tr><th colspan=\"2\" class=\"game_team_th game_team_middle_line\">Team 1</th><th colspan=\"2\" class=\"game_team_th\">Team 2</th></tr></thead><tbody>";
    for(let i = 0; i < minCombo.length; i++){
        let idx = scores.indexOf(minCombo[i]);
        team1_sum += scores[idx];
        team1_arr[i] = "<td class=\"game_team_td_name\">" + users[idx] + "</td><td class=\"game_team_td_score game_team_middle_line\">" + scores[idx] + "점</td>";
        scores.splice(idx, 1);
        users.splice(idx, 1);
    }
    for(let i = 0; i < scores.length; i++){
        idx = scores.indexOf(scores[i]);
        team2_sum += scores[idx];
        team2_arr[i] = "<td class=\"game_team_td_name\">" + users[idx] + "</td><td class=\"game_team_td_score\">" + scores[idx] + "점</td>";
    }

    // Print
    for (let i = 0; i < team1_arr.length; i++) {
        out_html += "<tr>" + team1_arr[i] + team2_arr[i] + "</tr>";
    }
    out_html += "<tr>" +
        "<td class=\"game_team_td_name\">합계</td><td class=\"game_team_td_score game_team_middle_line\">" + team1_sum + "점</td>" +
        "<td class=\"game_team_td_name\">합계</td><td class=\"game_team_td_score\">" + team2_sum + "점</td>" +
        "</tr></tbody></table>";
    output_div.innerHTML = out_html;
    copy_div.innerHTML = "<button class=\"game_team_btn\" id=\"game_team_copy\" onclick=\"game_team_copy();\" style=\"display: inline-block;\">img copy</button>";
}

function *game_team_combinations( combo, list, k ) {
    if ( k == 0 ) {
      yield combo;
    } 
    else
    {
        for ( let i = 0; i < list.length; i++ ) {
            yield *game_team_combinations( [...combo, list[ i ] ], list.slice( i + 1 ), k - 1 ); 
        }
    }
}

async function game_team_copy() {
    // Img Copy
    try{
        html2canvas(document.querySelector('#game_team_out_wrap')).then(canvas => {
            canvas.toBlob(blob => { navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            });
        });
        alert("클립보드에 복사되었습니다.");
    } catch (err) {
        console.error(err.name, err.message);
        alert("복사가 실패했습니다.");
    }
} 