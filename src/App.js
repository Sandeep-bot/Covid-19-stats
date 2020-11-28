import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
// let todayDate;
// function getCurrentDate(separator = "") {
//   let newDate = new Date();
//   let date = newDate.getDate();
//   let month = newDate.getMonth() + 1;
//   let year = newDate.getFullYear();

//   return (todayDate = `${year}${separator}${
//     month < 10 ? `0${month}` : `${month}`
//   }${separator}${date}`);
// }
// console.log(todayDate);

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 28.7041, lng: 77.1025 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setcasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? // ? setMapCenter([28.7041, 77.1025])
          // : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  //console.log(countryCode);
  //https://disease.sh/v3/covid-19/countries/[]

  return (
    <div>
      <div className="app">
        <div className="app_left">
          <div className="app_header">
            <h1>COVID-19 REALTIME DATA</h1>
            <FormControl className="app_dropdown">
              <Select
                variant="outlined"
                onChange={onCountryChange}
                value={country}
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="app_stats">
            <InfoBox
              isRed
              active={casesType === "cases"}
              onClick={(event) => setcasesType("cases")}
              title="Caronavirus Cases"
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={prettyPrintStat(countryInfo.cases)}
            />
            <InfoBox
              active={casesType === "recovered"}
              onClick={(event) => setcasesType("recovered")}
              title="Recovered"
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat(countryInfo.recovered)}
            />
            <InfoBox
              isRed
              active={casesType === "deaths"}
              onClick={(event) => setcasesType("deaths")}
              title="Deaths"
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={prettyPrintStat(countryInfo.deaths)}
            />
          </div>
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
        <Card className="app_right">
          <CardContent>
            <div className="app_information">
              <h3>live cases by country</h3>
              <Table countries={tableData} />
              <h3 className="app_graphTitle">worldwide new {casesType}</h3>
              <LineGraph className="app_graph" casesType={casesType} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="footer">
        <h2>
          “Life doesn’t get easier or more forgiving, we get stronger and more
          resilient.” --Steve Maraboli
        </h2>
        <a href="https://github.com/Sandeep-bot">@---Sandeep.p</a>
      </div>
    </div>
  );
}

export default App;

// const onCountryChange = async (event) => {
//   const countryCode = event.target.value

//   const url =
//     countryCode === 'worldwide' ?
//     'https://disease.sh/v3/covid-19/all' :
//     `https://disease.sh/v3/covid-19/countries/${countryCode}`
//   await fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//       setCountry(countryCode);
//       setCountryInfo(data);
//       setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
//       setMapZoom(4);
//     });

// };
