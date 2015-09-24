
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import Compiler = require('./Compiler');
import FileUtil = require('../lib/FileUtil');
import CopyFilesCommand = require("../commands/copyfile");
import ChangeEntranceCMD = require("../actions/ChangeEntranceCommand");

class CopyNativeFiles {
	static copyProjectFiles(platform, nativePath, isDebug){
        var options = egret.args;

        //拷贝项目到native工程中
        var cpFiles = new CopyFilesCommand();
        if (platform == "android") {
            var url2 = FileUtil.joinPath(nativePath, "proj.android/assets", "egret-game");
        }
        else if (platform == "ios") {
            url2 = FileUtil.joinPath(nativePath, "Resources", "egret-game");
        }
        FileUtil.remove(url2);

        if (isDebug) {
            var config = egret.args.properties;
            try {
                cpFiles.outputPath = url2;
                cpFiles.ignorePathList = config.getIgnorePath();
                cpFiles.execute();
            }
            catch(e) {
                globals.exit(10021);
            }

            var sourceRuntime = FileUtil.joinPath(options.templateDir, "runtime");
            var outputRuntime = FileUtil.joinPath(url2, "launcher");
            FileUtil.copy(sourceRuntime, outputRuntime);

            var sourceRuntime = FileUtil.joinPath(options.libsDir);
            var outputRuntime = FileUtil.joinPath(url2, "libs");
            FileUtil.copy(sourceRuntime, outputRuntime);
        }
        else {
            FileUtil.copy(options.releaseDir, url2);
        }
    }

    static refreshNative(isDebug, versionFile = null) {
        var config = egret.args.properties;
        var nativePath;
        if (nativePath = config.getNativePath("android")) {
            var url1 = FileUtil.joinPath(nativePath, "proj.android");
            var url2 = FileUtil.joinPath(nativePath, "proj.android/assets", "egret-game");

            CopyNativeFiles.copyProjectFiles("android", nativePath, isDebug);

            //修改java文件
            var entrance = new ChangeEntranceCMD();
            entrance.initCommand(url1, "android", versionFile);
            entrance.execute();
        }

        if (nativePath = config.getNativePath("ios")) {
            var url1 = FileUtil.joinPath(nativePath, "proj.ios");
            url2 = FileUtil.joinPath(nativePath, "Resources", "egret-game");

            CopyNativeFiles.copyProjectFiles("ios", nativePath, isDebug);

            //修改java文件
            var entrance = new ChangeEntranceCMD();
            entrance.initCommand(url1, "ios", versionFile);
            entrance.execute();
        }
    }
}

export = CopyNativeFiles;