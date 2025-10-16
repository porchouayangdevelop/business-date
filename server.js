import Fastify from 'fastify';
import {createPool} from 'mariadb';
import cors from '@fastify/cors';


const app = await Fastify({
	logger: {
		transport: {
			target: "@fastify/one-line-logger",
		},
	},
});


app.register(cors, {
	origin: '*',
});


const slapPool = createPool({
	host: '10.151.101.200',
	port: 4008,
	user: 'porchouayang',
	password: 'Pcy32@2024',
	database: 'core001',
	connectTimeout: 40000,
	connectionLimit: 10
});

const masterPool = createPool({
	host: '10.151.101.200',
	port: 4006,
	user: 'porchouayang',
	password: 'Pcy32@2024',
	database: 'core001',
	connectTimeout: 40000,
	connectionLimit: 10
});

const masterDate = async () => {
	let conn = await masterPool.getConnection();
	try {
		const [rows] = await
			conn.query('select AC_DATE lastDate, NEXT_AC_DATE as currentDate FROM sctjpam;');

		return rows
	} catch (e) {
		app.log.error(e);
	} finally {
		await conn.release();
	}
}

const slapDate = async () => {
	let conn = await slapPool.getConnection();
	try {
		const [rows] = await
			conn.query('select AC_DATE lastDate, NEXT_AC_DATE as currentDate FROM sctjpam;');
		console.log(rows);
		return rows
	} catch (e) {
		app.log.error(e);
	} finally {
		await conn.release();
	}
}


app.get('/business-date', async (request, reply) => {

	try {
		const [slap, master] =  await Promise.all([
			slapDate(),
			masterDate()
		])

		return  {
			slap,
			master
		}

	}catch (e) {
		return {
			error: e.message,
		}
	}
})


try {

	await app.listen({host: '0.0.0.0', port: 5333});

	app.log.info(`Server running on http://localhost:5333 `)

} catch (e) {
	process.exit(1);
}
