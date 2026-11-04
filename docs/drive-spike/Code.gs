// Throwaway spike. Proves the Drive v3 advanced service works with ONLY the drive.file scope.
// Run `spike` once (approve the consent screen), then read the log (View > Logs / Execution log).
function spike() {
  var log = [];
  var folder = Drive.Files.create({ name: 'Pluckr spike images', mimeType: 'application/vnd.google-apps.folder' }, null, { fields: 'id' });
  log.push('1 folder created: ' + folder.id);

  var png = Utilities.base64Decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
  var blob = Utilities.newBlob(png, 'image/png', "it's a.png");
  var file = Drive.Files.create({ name: "it's a.png", parents: [folder.id] }, blob, { fields: 'id' });
  log.push('2 file created in folder: ' + file.id);

  var q = "name = 'it\\'s a.png' and '" + folder.id + "' in parents and trashed = false";
  var found = Drive.Files.list({ q: q, fields: 'files(id)', pageSize: 1 }).files;
  log.push('3 list finds it again: ' + (found && found.length === 1 && found[0].id === file.id));

  Drive.Files.update({}, file.id, Utilities.newBlob(png, 'image/png', "it's a.png"));
  var again = Drive.Files.list({ q: q, fields: 'files(id)' }).files;
  log.push('4 update replaces, still one file: ' + (again.length === 1));

  var got = Drive.Files.get(folder.id, { fields: 'id,trashed' });
  log.push('5 folder get works, trashed=' + got.trashed);

  Drive.Files.update({ trashed: true }, folder.id);
  var trashed = Drive.Files.get(folder.id, { fields: 'id,trashed' });
  log.push('6 trashed folder is detectable: ' + (trashed.trashed === true));

  log.push('URL: https://drive.google.com/drive/folders/' + folder.id + ' (in Trash now; delete it)');
  Logger.log(log.join('\n'));
}
