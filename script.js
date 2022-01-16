// select countries
let HttpReq = new XMLHttpRequest();

HttpReq.open("GET","https://api.covid19api.com/summary");


HttpReq.onreadystatechange = ()=>{
    // console.log("Status : ",HttpReq.onreadyState);
    if(HttpReq.readyState == 4 && HttpReq.status == 200){
        let rep = JSON.parse(HttpReq.response);
        let CountriesBox = document.querySelector(".CountriesBox");
        let countries = rep.Countries;
        countries.forEach(element => {
            let newDiv = document.createElement("option");
            newDiv.value = element.Country;
            newDiv.appendChild(document.createTextNode(element.Country));
            newDiv.classList.add('CountryBox');
            newDiv.onclick=getCountryData;
            CountriesBox.appendChild(newDiv);
            
        });
    }
}

HttpReq.send();

// Chart

var Dates = new Array();
var Confirmed = new Array();
var Deaths = new Array();
var Recovered = new Array();
var Active = new Array();

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '# of confirmed',
            data: [],
            borderColor: "red"
        },
        {
            label: '# of deaths',
            data: [],
            borderColor: "black"
        },
        {
            label: '# of recovred',
            data: [],
            borderColor: "green"
        },
        {
            label: '# of active',
            data: [],
            borderColor: "blue"
        },]
    },
    options: {
        title: {
            display: true,
            text: 'Custom Chart Title'
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});


// Get information about the country

function getCountryData(e){
    myChart.options.title.text = e.target.innerText;
    let httpReq = new XMLHttpRequest();
    let resp;
    httpReq.open("GET","https://api.covid19api.com/dayone/country/"+this.value);
    httpReq.onreadystatechange = ()=>{
        if(httpReq.readyState == 4 && httpReq.status == 200){
            resp = JSON.parse(httpReq.response);
            Dates.length = 0;
            Confirmed.length = 0;
            Deaths.length = 0;
            Recovered.length = 0;
            Active.length = 0;
            resp.forEach(element => {
                Dates.push(element.Date.substr(0,10));
                Confirmed.push(element.Confirmed);
                Deaths.push(element.Deaths);
                Recovered.push(element.Recovered);
                Active.push(element.Active);
            });

            //console.log(Confirmed);
            myChart.data.labels = Dates;
            myChart.data.datasets['0'].data = Confirmed;
            myChart.data.datasets['1'].data = Deaths;
            myChart.data.datasets['2'].data = Recovered;
            myChart.data.datasets['3'].data = Active;
            //var chart = new Chart(ctx,myChart);
        }
    }
    httpReq.send();
}