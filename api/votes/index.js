const { getVoteCount } = require('../sheets-helper');

module.exports = async function (context, req) {
  context.log('GET /api/votes - Fetching current vote count');

  try {
    const voteCount = await getVoteCount();

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Enable CORS
      },
      body: {
        count: voteCount,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    context.log.error('Error fetching vote count:', error);

    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        error: 'Failed to fetch vote count',
        message: error.message,
      },
    };
  }
};
