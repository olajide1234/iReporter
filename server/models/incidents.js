const redFlagRecords = new Map([
  [1, {
    id: 1,
    createdOn: '24 April 2018',
    createdBy: '124', // represents the user who created this record
    type: 'Red-flag', // [red-flag, intervention]
    dateOfIncident: '23 April 2018',
    title: 'How police extorted me',
    comment: 'Despite their recent increase in salary, police extorted me at Unilag Gate',
    images: ['https://olajide1234.github.io/iReporter/UI/img/corruption2.jpg', 'https://olajide1234.github.io/iReporter/UI/img/corruption1.jpg'],
    videos: ['https://www.youtube.com/watch?v=_e92yME-PHY'],
    location: 'lat: 6.553844,lng: 3.366475', // Lat Long coordinates
    status: 'draft', // [draft, under investigation, resolved, rejected]
  }],
]);

module.exports = redFlagRecords;
