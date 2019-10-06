'use strict';

const {Datastore} = require('@google-cloud/datastore');

const ds = new Datastore();
const kind = 'Customer';


function fromDatastore(obj) {
  obj.id = obj[Datastore.KEY].id;
  return obj;
}

function list(limit, token, cb) {
    const customerkey = ds.key(kind);
    const entities = [
    {
        key: customerkey,
        data: {
            fullName: 'John Daoe',
            address: '5 street Andre Raul',
            mobile: '012345678'
        }
    },
    {
        key: customerkey,
        data: {
            fullName: 'Raul Garcia',
            address: '5 Rue verdan',
            mobile: '012345786'
        }
    },
    {
        key: customerkey,
        data: {
            fullName: 'Maria Solinc',
            address: '12 Street grand bouvard',
            mobile: '012345767'
        }
    }
    ];
    
    ds.save(entities, (err, apiResponse) => {});


  const q = ds
    .createQuery([kind])
    .limit(limit)
    .order('fullName')
    .start(token);

  ds.runQuery(q, (err, entities, nextQuery) => {
    if (err) {
      cb(err);
      return;
    }
    const hasMore =
      nextQuery.moreResults !== Datastore.NO_MORE_RESULTS
        ? nextQuery.endCursor
        : false;
    cb(null, entities.map(fromDatastore), hasMore);
  });
}

function read(id, cb) {
  const key = ds.key([kind, parseInt(id, 10)]);
  ds.get(key, (err, entity) => {
    if (!err && !entity) {
      err = {
        code: 404,
        message: 'Not found',
      };
    }
    if (err) {
      cb(err);
      return;
    }
    cb(null, fromDatastore(entity));
  });
}

module.exports = {
  read,
  list,
};
