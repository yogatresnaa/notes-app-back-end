/* eslint-disable max-len */
const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const init = async () => {
  const notesService = new NotesService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  // Di sini kamu bisa mendeklarasikan atau membuat extentions function untuk life cycle server onPreResponse, di mana ia akan mengintervensi response sebelum dikirimkan ke client. Di sana kamu bisa menetapkan error handling bila response tersebut merupakan client error.

  //  server.ext('onPreResponse', (request, h) => { // mendapatkan konteks response dari request const { response } = request; if (response instanceof ClientError) { // membuat response baru dari response toolkit sesuai kebutuhan error handling const newResponse = h.response({ status: 'fail', message: response.message, }); newResponse.code(response.statusCode); return newResponse; } // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi) return response.continue || response; });

  //   Dengan begitu, di handler, kamu bisa fokus terhadap logika dalam menangani request, tanpa adanya error handling.

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
