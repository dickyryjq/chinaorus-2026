const { incrementVote } = require('../sheets-helper');

module.exports = async function (context, req) {
  context.log('POST /api/vote - Incrementing vote count');

  try {
    const newCount = await incrementVote();

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Enable CORS
      },
      body: {
        count: newCount,
        message: 'Vote recorded successfully',
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    context.log.error('Error incrementing vote:', error);

    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        error: 'Failed to record vote',
        message: error.message,
      },
    };
  }
};
