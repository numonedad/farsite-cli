const axios = require('axios');
const path = require('path');

const v = require( path.resolve( __dirname, './vars.js' ) );

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
    return data;
  } catch (error) {
    console.error(error);
  }
}

const planets = async () => {
  const resourceDetails = await getResources();
  const totalResources = new Array(157).fill(0);

  const promises = [];
  Planets.forEach(planet => {
    promises.push(getPlanetSectors(planet))
  })

  const planetDetails = await Promise.all(promises);
  planetDetails.forEach(planet => {
    planet.forEach(({ resources }) => {
      const { spots, deposits } = resources;
      const sectorResources = spots.concat(deposits);
      sectorResources.forEach(res => totalResources[res]++);
    })
  })

  const mappedTotalResources = resourceDetails.reduce((acc, { code, id }) => {
    return (totalResources[id] > 0) ? [...acc, {[code]: totalResources[id]}] : acc;
  }, [])

  mappedTotalResources.forEach(res => {
    const [ code, amount ] = Object.entries(res)[0];
    console.log(`${code}, ${amount},`);
  });
}

module.exports = planets;
