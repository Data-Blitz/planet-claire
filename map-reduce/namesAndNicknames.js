function(doc) {
    if (doc.type === 'names') {
        if (doc.uri === 'male-names-w-nicknames') {
            data = [];
            data = doc.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].name !== '') {
                    if (data[i].nick5) {
                        emit(data[i].name, [data[i].nick1,data[i].nick2,data[i].nick3, data[i].nick4, data[i].nick5 ]);
                    }
                    else if (data[i].nick4) {
                        emit(data[i].name, [data[i].nick1,data[i].nick2,data[i].nick3, data[i].nick4]);
                    }
                    else if (data[i].nick3) {
                        emit(data[i].name, [data[i].nick1,data[i].nick2,data[i].nick3]);
                    }
                    else if (data[i].nick2) {
                        emit(data[i].name, [data[i].nick1,data[i].nick2]);
                    }
                    else if (data[i].nick1) {
                        emit(data[i].name, [data[i].nick1]);
                    }
                    else {
                        emit(data[i].name, []);
                    }

                }
            }
        }
    }
}