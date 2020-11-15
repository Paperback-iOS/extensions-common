var tsify = require('tsify')
var browserify = require('browserify')

var source = require('vinyl-source-stream')
var gulp = require('gulp')

//requiring path and fs modules
const path = require('path')
const fs = require('fs')

const bundleSources = async function () {

    // Yeah, I get this magic number is sketchy, but given that repositories run a gulpfile inside of their node_modules not much can be done
    // I can guarintee that this number will always be constant though
    // as it substrings out node_modules/paperback-extensions-common/src
    let basePath = process.cwd().substr(0, process.cwd().length - 44)
    const directoryPath = path.join(basePath, 'src')
    const destDir = path.join(basePath, 'bundles')

    // If the bundles directory does not exist, create it here
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir)
    }

    var promises = []

    var bundleThis = function (srcArray) {
        for (let file of srcArray) {
            let filePath = file

            if (file == "tests") {
                console.log("Tests directory, skipping")
                continue
            }

            // If its a directory
            if (
                !fs.statSync(path.join(directoryPath, filePath)).isDirectory()
            ) {
                console.log('Not a directory, skipping ' + filePath)
                continue
            }

            let finalPath = path.join(directoryPath, filePath, `/${file}.ts`)

            if (!fs.existsSync(finalPath)) {
                console.log("The file doesn't exist, skipping. " + filePath)
                continue
            }

            promises.push(
                new Promise((res, rej) => {
                    browserify([finalPath], { standalone: 'Sources' })
                        .plugin(tsify, {project: "tsconfig.tsify.json", target: 'es6'})
                        .bundle()
                        .pipe(source('source.js'))
                        .pipe(gulp.dest(path.join(destDir, file)))
                        .on('end', () => {
                            copyFolderRecursive(
                                path.join(directoryPath, filePath, 'includes'),
                                path.join(destDir, file)
                            )

                            res()
                        })
                })
            )
        }
    }

    const bundlesPath = path.join(__dirname, 'bundles')

    deleteFolderRecursive(bundlesPath)
    bundleThis(fs.readdirSync(directoryPath))

    await Promise.all(promises) //.then(function () { done() })
}

const generateVersioningFile = async function () {
    let jsonObject = {
        buildTime: new Date(),
        sources: []
    }

    //joining path of directory
    let basePath = process.cwd().substr(0, process.cwd().length - 44)
    const directoryPath = path.join(basePath, 'src')
    var promises = []

    // If the bundles directory does not exist, create it here
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath)
    }
    

    var generateSourceList = function (srcArray) {

        console.log(srcArray)
        for (let sourceId of srcArray) {

            // Files starting with . should be ignored (hidden) - Also ignore the tests directory
            if(sourceId.startsWith('.') || sourceId.startsWith('tests')) {
                continue
            }
            
            // If its a directory
            if (!fs.statSync(path.join(directoryPath, sourceId)).isDirectory()) {
                console.log('not a Directory, skipping ' + sourceId)
                return
            }

            let finalPath = path.join(basePath, 'bundles', sourceId, 'source.js') 

            promises.push(
                new Promise((res, rej) => {
                    let req = require(finalPath)
                    let extension = req[sourceId]

                    let classInstance = new extension(null)

                    // make sure the icon is present in the includes folder.
                    if (!fs.existsSync(path.join(directoryPath, sourceId, 'includes', classInstance.icon))) {
                        console.log('[ERROR] [' + sourceId + '] Icon must be inside the includes folder')
                        rej()
                        return
                    }

                    jsonObject.sources.push({
                        id: sourceId,
                        name: classInstance.name,
                        author: classInstance.author,
                        desc: classInstance.description,
                        website: classInstance.authorWebsite,
                        version: classInstance.version,
                        icon: classInstance.icon,
                        tags: classInstance.sourceTags,
                        websiteBaseURL: classInstance.websiteBaseURL
                    })

                    res()
                })
            )
        }
    }

    generateSourceList(fs.readdirSync(path.join(basePath, 'src')))
    await Promise.all(promises)

    // Write the JSON payload to file
    fs.writeFileSync(
        path.join(basePath, 'bundles', 'versioning.json'),
        JSON.stringify(jsonObject)
    )
}

const deleteFolderRecursive = function (folderPath) {
    folderPath = folderPath.trim()
    if (folderPath.length == 0 || folderPath === '/') return

    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file, index) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
};

const copyFolderRecursive = function (source, target) {
    source = source.trim()
    if (source.length == 0 || source === '/') return

    target = target.trim()
    if (target.length == 0 || target === '/') return

    if (!fs.existsSync(source)) return

    var files = [];
    //check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    //copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursive(curSource, targetFolder);
            } else {
                fs.copyFileSync(curSource, path.join(targetFolder, file));
            }
        });
    }
}

// exports.bundle = bundleSources
exports.bundle = gulp.series(bundleSources, generateVersioningFile)
