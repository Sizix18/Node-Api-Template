import app from './app';

app.listen(app.settings.port, () =>
  console.info(
    `${app.pkg.name} version ${app.pkg.version} started on ${
      app.settings.port
    }`,
  ),
);
