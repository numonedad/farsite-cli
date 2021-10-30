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
  return config.Resources[id].code
}

module.exports = async(userid) => {
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
  console.log('resources', resources)

}
