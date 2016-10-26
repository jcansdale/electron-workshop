import {ipcRenderer as ipc, remote, clipboard, shell} from 'electron'
import * as $ from 'jquery'
const mainProcess = remote.require('./main')
const marked = require('marked')

const $markdownView = $('.raw-markdown')
const $htmlView = $('.rendered-html')
const $openFileButton = $('#open-file')
const $saveFileButton = $('#save-file')
const $copyHtmlButton = $('#copy-html')
const $showInFileSystemButton = $('#show-in-file-system')
const $openInDefaultEditorButton = $('#open-in-default-editor')

let currentFile: string = null

ipc.on('file-opened', (event, file, content) => {
  currentFile = file
  $showInFileSystemButton.attr('disabled', false)
  $openInDefaultEditorButton.attr('disabled', false)

  $markdownView.val(content)
  renderMarkdownToHtml(content)
})

function renderMarkdownToHtml (markdown) {
  const html = marked(markdown)
  $htmlView.html(html)
  mainProcess.setHtml(html)
}

$markdownView.on('keyup', (event) => {
  const content = $(event.target).val()
  renderMarkdownToHtml(content)
})

$openFileButton.on('click', () => {
  mainProcess.openFile()
})

$copyHtmlButton.on('click', () => {
  const html = $htmlView.html()
  clipboard.writeText(html)
})

$saveFileButton.on('click', () => {
  mainProcess.saveFile()
})

$(document).on('click', 'a[href^="http"]', (event) => {
  event.preventDefault()
  const target = <HTMLAnchorElement>event.target
  shell.openExternal(target.href)
})

$showInFileSystemButton.on('click', () => {
  shell.showItemInFolder(currentFile)
})

$openInDefaultEditorButton.on('click', () => {
  shell.openItem(currentFile)
})
