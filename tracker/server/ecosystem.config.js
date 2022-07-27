module.exports = {
	apps: [
		{
			name: 'TechBase',
			script: './server.js',
			watch: true,
			exec_mode: 'cluster',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
}
