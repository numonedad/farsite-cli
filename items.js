const axios = require('axios');
var path = require('path');
const v = require( path.resolve( __dirname, './vars.js' ) );

const listBlueprints = async (userid) => {
  try {
    const { data } = await axios.get(v.BaseUrl + '/blueprints/' + userid + '/list');
    return data;
  } catch (error) {
    console.error(error);
  }
}

const getBlueprint = async (id) => {
  try {
    const { data } = await axios.get(v.BaseUrl + '/blueprints/' + id);
    return data;
  } catch (error) {
    console.error(error);
  }
}

const listOriginals = async () => {
  try {
    const { data } = await axios.get(v.BaseUrl + '/components/originals');
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

const getScheme = async () => {
  try {
    const { data } = await axios.get(v.BaseUrl + '/config/schemes');
    return data;
  } catch (error) {
    console.error(error);
  }
}

const resourceName = (config, id) => {

  let match = config.Resources.find(res => res.id == id)
  if (match == undefined) {
    return id
  }
  return match.code
}

// https://farsite.online/api/1.0/universe/sectors/my
const listSectors = async () => {
  try {
    const { data } = await axios.get(v.BaseUrl + '/universe/sectors/my', opts);
    return data;
  } catch (error) {
    console.error(error);
  }
}

let opts = {}

const produce = async(userid, options) => {
  opts = options

  const config = await getConfig();
  const scheme = await getScheme();
  const sectors = await listSectors();

  let deposit = {};
  let spot = {};

  sectors.forEach(( sector ) => {
    let d = sector.resources.deposits
    d.forEach((id) => {
      let key = resourceName(config, id);
      if (!deposit[key]) {
        deposit[key] = 0;
      }
      deposit[key]++;
    });
  })

  sectors.forEach(( sector ) => {
    let d = sector.resources.spots
    d.forEach((id) => {
      let key = resourceName(config, id);
      if (!spot[key]) {
        spot[key] = 0;
      }
      spot[key]++;
    });
  })

  return {
    deposit, spot
  }
}

const consume = async(userid, options) => {
  opts = options

  const config = await getConfig();
  const scheme = await getScheme();

  const bps = await listBlueprints(userid);
  let resources = {};
  bps.forEach(({ id, original }) => {
    let components = scheme.Blueprints[original.id]

    for (k in components.Requirements.Components) {
      let key = resourceName(config, k)
      if (!resources[key]) {
        resources[key] = 0
      }
      resources[key]++
    }
  })
  return resources

}

module.exports = {
  consume: consume,
  produce: produce,
}
