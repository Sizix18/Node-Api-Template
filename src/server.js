import app from './app';
import settings from '../settings';

app.listen(settings.port, () =>
  console.log(
    `${app.pkg.name} version ${app.pkg.version} started on ${settings.port}`,
  ),
);
