export const environment = {
  production: false,
  // local
  // authService: 'http://localhost:3001',
  // rolesService: 'http://localhost:3002',
  // usersService: 'http://localhost:3003',
  // reportsService: 'http://localhost:3004',
  // local ip
  //authService: 'http://192.168.1.7:3001',
  //rolesService: 'http://192.168.1.7:3002',
  //usersService: 'http://192.168.1.7:3003',
  //reportsService: 'http://192.168.1.7:3004',
  // ec2
  //authService: 'http://54.227.214.48:3001',
  //rolesService: 'http://54.227.214.48:3002',
  //usersService: 'http://54.227.214.48:3003',
  //reportsService: 'http://54.227.214.48:3004',
  // api gateway
  authService: 'https://nrmj717c50.execute-api.us-east-1.amazonaws.com/api',
  rolesService: 'https://nrmj717c50.execute-api.us-east-1.amazonaws.com/api',
  usersService: 'https://nrmj717c50.execute-api.us-east-1.amazonaws.com/api',
  reportsService: 'https://nrmj717c50.execute-api.us-east-1.amazonaws.com/api',
  googleMaps: {
    apiUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
    apiKey: 'AIzaSyAJ478F-j5lB0tS0Eq510lxhSE6DyAsOn4',
    mapId: '9b08a75eed2d2c9de1da4f1a',
  },
};
