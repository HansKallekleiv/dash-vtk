import React from 'react';
import PropTypes from 'prop-types';

import { PolyData, PointData, DataArray } from '../AsyncReactVTK';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData.js';
import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
/**

 */
function makeData(values, origin, xinc, yinc, rotation) {

    let jSize = values.length
    let iSize = values[0].length

    let pointValues = []
    let polysValues = []
    let polysValues2 = []
    const t0 = performance.now()
    for (let j = 0; j < jSize; j++) {
        for (let i = 0; i < iSize; i++) {
            const offsetIdx = j * iSize + i;

            // Fill points coordinates
            pointValues.push(
                origin[0] + (j * Math.cos(rotation * Math.PI / 180) * xinc) - (i * Math.sin(rotation * Math.PI / 180) * yinc))

            pointValues.push(
                origin[1] + (j * Math.sin(rotation * Math.PI / 180) * xinc) + (i * Math.cos(rotation * Math.PI / 180) * yinc))
            pointValues.push(
                origin[2] + values[j][i] * 1)



            // Fill polys
            if (i > 0 && j > 0) {

                polysValues.push(4);
                polysValues.push(offsetIdx);
                polysValues.push(offsetIdx - 1);
                polysValues.push(offsetIdx - 1 - iSize);
                polysValues.push(offsetIdx - iSize);

            }

        }
    }
    console.log(performance.now() - t0)



    return { "points": pointValues, "polys": polysValues }
}
export default function Surface(props) {
    const data = makeData(props.values, props.origin, props.xinc, props.yinc, props.rotation)


    return (
        <PolyData
            id={props.id}
            points={data["points"]}
            polys={data["polys"]}
        >
            <PointData>
                <DataArray
                    name={"Values"}
                    registration={"setScalars"}
                    values={props.values.flat()}
                />
            </PointData>
        </PolyData>

    );
};

Surface.defaultProps = {
    port: 0,

};

Surface.propTypes = {
    /**
     * The ID used to identify this component.
     */
    id: PropTypes.string,

    /**
     * downstream connection port
     */
    port: PropTypes.number,

    /**
     * State of the volume
     */
    xinc: PropTypes.number,
    yinc: PropTypes.number,
    origin: PropTypes.array,
    rotation: PropTypes.number,
    values: PropTypes.array
};
