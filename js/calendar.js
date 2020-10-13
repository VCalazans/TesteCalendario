
var formEventoAtivo = false;

var mapEvents = new Map();
mapEvents.set(1, ["Teste, notificação!", "08:00"])
mapEvents.set(5, ["Teste, notificação!", "08:00"])

var data;

var ano; 
var dia; 
var mes; 
var dia_semana; 



function calendario() {

    if (data == undefined)
        setDate();

    var A_mes = new Array("Janeiro", "Fevereiro", "Março", "Abril", "Maio",
        "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro",
        "Dezembro");
    var A_dia = new Array("Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab");

    data.setDate(1);
    calendario = '<table id="tbCalendar"> <tr> <th colspan="7" style="float:left;">' + A_mes[mes] + ' de ' + ano;
    calendario += '<th colspan="1" > <a onclick="setDate(false, true)"><</a> <a style="margin-left:20px;" onclick="setDate(true, false)">></a> </th>';
    calendario += '<tr>';
    for (var i = 0; i < 7; i++) {
        if (dia_semana == i) {
            calendario += '<td style="border:none;"><b>' + A_dia[i] + '</b></td>';
        } else {
            calendario += '<td style="border:none;">' + A_dia[i] + '</td>';
        }
    }
    calendario += '</tr>';
    for (i = 0; i < data.getDay(); i++) {
        calendario += '<td></td>';
    }

    for (i = 0; i < 31; i++) {
        if (data.getDate() > i) {
            dia_semana = data.getDay();
            if (dia_semana == 0)
                calendario += '<tr>';
            if (dia_semana != 7) {
                if (dia == data.getDate())
                    calendario += "<td id=\"dia" + i + "\" onclick=\"activateForm('#dia" + i + "')\"><b>" + (i + 1) + "</b> </td>";
                else
                    calendario += "<td id=\"dia" + i + "\" onclick=\"activateForm('#dia" + i + "')\">" + (i + 1) + "</td>";
            }
            if (dia_semana == 7)
                calendario += '</tr>';
        }
        data.setDate(data.getDate() + 1);
    }

    calendario += '</td></tr></table>';
    return calendario;

}

function setDate(inc = false, dec = false) {

    
    if (data == undefined)
        data = new Date();

    if(!localStorage.getItem("ano"))
        localStorage.setItem("ano", data.getFullYear()); 
    else
        data.setFullYear(parseInt(localStorage.getItem("ano")));

    if(!localStorage.getItem("mes"))
        localStorage.setItem("mes", data.getMonth()); 
    
    var teste = localStorage.getItem("mes");

    if (dec){
        if(localStorage.getItem("mes") == 0){
            data.setFullYear((data.getFullYear() - 1));
            localStorage.setItem("ano", data.getFullYear()); 
            data.setMonth(11);
            localStorage.setItem("mes", 11); 
            
        }else{
            data.setMonth(parseInt(localStorage.getItem("mes")) - 1);
            localStorage.setItem("mes", data.getMonth()); 
        }
    }else if (inc){
        
        if(localStorage.getItem("mes") == 11){
            data.setFullYear(data.getFullYear() + 1);
            localStorage.setItem("ano", data.getFullYear()); 
            data.setMonth(0);
            localStorage.setItem("mes", 0); 
            
        }else{
            data.setMonth(parseInt(localStorage.getItem("mes")) + 1);
            localStorage.setItem("mes", data.getMonth()); 
        }
    }
    else
        data.setMonth(parseInt(localStorage.getItem("mes")));

    ano = data.getFullYear();
    dia = data.getDate();
    mes = data.getMonth();
    dia_semana = data.getDay();

    if (inc || dec) {
        window.location.reload(true);
    }

}

function loadEvents() {

    for (var [key, value] of mapEvents) {
        $("#dia" + key).append("<br/> <a>" + value[1] + "|" + value[0] + "</a>");
    }
}

function activateForm(dia = "") {
    dia = dia.replace("#", '');
    if (!formEventoAtivo)
        $("#" + dia).append("<div id=\"formEvento\" style=\"background: gray; align-self: flex-end; position: absolute; width:200px; height:150px; z-index: 1;\"> <input id=\"descricao\" type=\"text\" style=\"margin-top:30px; margin-right:10px;\"placeholder=\"descrição\"/></br> <input id=\"hora\" type=\"text\" style=\"margin-top:10px; margin-right:10px;\" placeholder=\"hora\"/><br/> <button id='btSalvar" + dia + "' style=\"margin-top:10px; margin-right:10px;\">Salvar</button> </div>");

    formEventoAtivo = true;
}

$(document).ready(function () {

    for (i = 0; i < 31; i++) {
        $(document).on('click', "#btSalvardia" + i, function () {

            //CADASTRA NOVO EVENTO
            var descricao = $("#descricao").val();
            var hora = $("#hora").val();
            var dia = data.setDate(i+1);
            var vData ={ "descricao": descricao, "hora": hora, "dia": dia};
             
            $.ajax({
                type: "POST",
                url: "DAO/cadastrar_evento.php",
                data: vData,
                success: function (data) {
                    if (data == "success") {
                        alert("Cadastrado com sucesso! ");
                        //atualiza a página!
                        location.reload();
                    } else {
                        alert("Houve algum problema.. ");
                    }
                }
            });
            $("#formEvento").remove();
            formEventoAtivo = false;
            return false;
        });


    }
});


