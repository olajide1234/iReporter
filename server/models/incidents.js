const redFlagRecords = new Map([
  [1, {
    id: 1,
    createdOn: 'Sample date',
    createdBy: 'Sample Creator', // represents the user who created this record
    type: 'Sample record type', // [red-flag, intervention]
    dateOfIncident: 'Sample date',
    title: 'Sample title',
    comment: 'Sample comment',
    Images: ['Sample Image'],
    Videos: ['Sample Video'],
    location: 'Sample record location', // Lat Long coordinates
    status: 'Sample status', // [draft, under investigation, resolved, rejected]
  }],
]);

module.exports = redFlagRecords;
