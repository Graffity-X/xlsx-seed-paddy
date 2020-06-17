const exec = require('child_process').exec
const glob = require('glob')
const path = require('path')

// 自分で設定する場合、docker-composeのenvironmentsに定義すればprocess.envに入るので、ここで読まれる。
const {
  VERSION, 
  GLOB_TEXT, // Excelファイルまでのパス。docker-composeでsrc/*.xlsxと指定。
  COLUMN_NAMES_ROW,
  DATA_START_ROW
} = process.env;

const DEFAULT_TARGET_VERSION = '1.1.3'
const DEFAULT_COLUMN_NAMES_ROW = '2'　//Excelのカラムの行の位置
const DEFAULT_DATA_START_ROW = '3' //データの始まる行の位置

function main() {
  // VERSIONがあるなら上書き
  let targetVersion = DEFAULT_TARGET_VERSION
  if(VERSION) {
    targetVersion = VERSION
  }
  //カラムの行の決定
  let columnNamesRow = DEFAULT_COLUMN_NAMES_ROW
  if(COLUMN_NAMES_ROW) {
    columnNamesRow = COLUMN_NAMES_ROW
  }
  //データの行の決定
  let dataStartRow = DEFAULT_DATA_START_ROW
  if(DATA_START_ROW) {
    dataStartRow = DATA_START_ROW
  }

  const configContent = '"' + [
      'column_names_row: ' + columnNamesRow,
      'data_start_row: ' + dataStartRow
  ].join('\n') + '"'
  const xlsx2seedCmd = 'xlsx2seed'
  const GLOB_TEXT = "src/*.xlsx"

  const cmdPrefix = [xlsx2seedCmd, '-R', targetVersion, '-n dummy', '-v version', '-i src/', '-o dist/', '-C', configContent].join(' ')
  // const cmdPrefix = [xlsx2seedCmd, '-i src/', '-o dist/', '-C', configContent].join(' ')
  glob(GLOB_TEXT, function(err, files) {
    files.forEach(function(file) {
      const targetFile = path.basename(file)
      const cmd = [cmdPrefix, targetFile].join(' ')
      console.log(cmd)
      exec(cmd, function(error, stdout, stderr) {
        if(stdout){
          console.log('stdout: ' + stdout)
        }
        if(stderr){
          console.log('stderr: ' + stderr)
        }
        if (error !== null) {
          console.log('Exec error: ' + error)
        }
      });
    });
  })
}


module.exports = main
