PP.MeshUtils = {
    createPlaneMesh: function () {
        const vertexCount = 4;
        const vertexDataSize = WL.Mesh.VERTEX_FLOAT_SIZE; // vertex is like a class with x,y,z,u,v,normal unwrapped in an array

        let vertexData = new Float32Array(vertexCount * vertexDataSize);
        let indexData = new Uint32Array(vertexCount + 2); // +2 repeated vertexes

        for (let i = 0; i < 4; ++i) {
            vertexData[i * vertexDataSize + WL.Mesh.POS.X] = -1 + (i & 1) * 2;
            vertexData[i * vertexDataSize + WL.Mesh.POS.Y] = -1 + ((i & 2) >> 1) * 2; // this is a quick way to have positions (-1,-1) (1,-1) (1,-1) (1,1)
            vertexData[i * vertexDataSize + WL.Mesh.POS.Z] = 0;

            vertexData[i * vertexDataSize + WL.Mesh.TEXCOORD.U] = (i & 1);
            vertexData[i * vertexDataSize + WL.Mesh.TEXCOORD.V] = ((i & 2) >> 1);

            vertexData[i * vertexDataSize + WL.Mesh.NORMAL.X] = 0;
            vertexData[i * vertexDataSize + WL.Mesh.NORMAL.Y] = 0;
            vertexData[i * vertexDataSize + WL.Mesh.NORMAL.Z] = 1;
        }

        indexData[0] = 0;
        indexData[1] = 1;
        indexData[2] = 2;
        indexData[3] = 2;
        indexData[4] = 1;
        indexData[5] = 3;

        let mesh = new WL.Mesh({
            indexData: indexData,
            indexType: WL.MeshIndexType.UnsignedInt,
            vertexData: vertexData
        });

        return mesh;
    }
};