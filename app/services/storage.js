var azure = require('azure-storage');

// var blobSvc = azure.createBlobService();

var blobSvc = azure.createBlobServiceAnonymous('https://gpuformldiag201.blob.core.windows.net/');.
// https://gpuformldiag201.blob.core.windows.net/storage

blobSvc.createContainerIfNotExists('mturk-annot', {publicAccessLevel : 'blob'}, function(error, result, response){
    if(!error){
      // Container exists and allows
      // anonymous read access to blob
      // content and metadata within this container
    }
});