const axios = require('axios');
const path = require('path');

const v = require( path.resolve( __dirname, './vars.js' ) );

const BaseUrl = v.BaseUrl;
const Blueprint = v.Blueprint;
const Planets = v.Planets;

const getResources = async () => {
  try {
    const { data: { Resources } } = await axios.get(BaseUrl + '/config');
    return Resources;
  } catch (error) {
    console.error(error);
  }
}

const getPlanetSectors = async (planetName) => {
  try {
    const { data } = await axios.get(BaseUrl + '/universe/planets/' + planetName + '/sectors/');
    data.forEach((data) => data.planet = planetName)
    return data;
  } catch (error) {
    console.error(error);
  }
}


const getConfig = async () => {
  try {
    const { data } = await axios.get(v.BaseUrl + '/config');
    return data;
  } catch (error) {
    console.error(error);
  }
}

const resourceName = (config, id) => {
  if (!config.Resources[id]) {
    return id
  }
  return config.Resources[id].code
}

const planets = async () => {

  const config = await getConfig();
  const resourceDetails = await getResources();
  const totalResources = new Array(157).fill(0);

  // resourceCode: { spot: { 'Planet-ID': count }, deposit: { 'Planet-ID': count } }
  const res = {}

  const promises = [];
  Planets.forEach(planet => {
    promises.push(getPlanetSectors(planet))
  })

  const planetDetails = await Promise.all(promises);

  // planet == sector
  planetDetails.forEach(planet => {
    planet.forEach(({ planet, id, ownerId, resources }) => {
      if (ownerId != 0) {
        return;
      }
      const { spots, deposits } = resources;
      const sectorResources = spots.concat(deposits);
      sectorResources.forEach(res => totalResources[res]++);
      let sectorID = planet + "-" + id;
      sectorResources.forEach(sRes => {
        let code = resourceName(config, sRes)
        //console.log('hi', sectorID, res, code)
        if (!res[code]) {
          res[code] = {
            mix: {},
            spot: {},
            deposit: {}
          }
        }

        if (!res[code].mix[sectorID]) {
          res[code].mix[sectorID] = 0
        }
        res[code].mix[sectorID]++;
      })
    })
  })

  // const mappedTotalResources = resourceDetails.reduce((acc, { code, id }) => {
  //   return (totalResources[id] > 0) ? [...acc, {[code]: totalResources[id]}] : acc;
  // }, [])

  // mappedTotalResources.forEach(res => {
  //   const [ code, amount ] = Object.entries(res)[0];
  //   console.log(`${code}, ${amount},`);
  // });

  return res
}

module.exports = planets;
