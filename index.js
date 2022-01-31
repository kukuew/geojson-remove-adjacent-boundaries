import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader.js'
import GeoJSONWriter from 'jsts/org/locationtech/jts/io/GeoJSONWriter.js'
import 'jsts/org/locationtech/jts/monkey.js' // union does not work without this lib
import fs from 'fs'

const srcFile  = './src.json',
      distFile = './dist.json'

fs.readFile(srcFile, (err, data) => {
    let geojson     = JSON.parse(data),
        reader      = new GeoJSONReader(),
        writer      = new GeoJSONWriter(),

        geoms       = geojson.features.map(feature => reader.read(feature.geometry)) // Iterate through GeoJSON Features and reading geometry with collecting it to array
                      .map( geom => geom.buffer(0.001) ), // Iterate through geometries and apply small buffer to cross all contiguous boundaries
        union       = geoms.reduce( (prevGeom, currentGeom) => prevGeom.union(currentGeom)) // Combines overlapping polygons

    fs.writeFileSync(distFile, JSON.stringify(writer.write(union))) // Saving to file!
})