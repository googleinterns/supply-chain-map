import { writeFile } from 'fs';
const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `
export const environment = {
  production: true,
  googleMapApi: '${process.env.GMAPS_API_KEY}',
  clientId: '${process.env.CLIENT_ID}',
  projectId: '${process.env.PROJECT_ID}'
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
