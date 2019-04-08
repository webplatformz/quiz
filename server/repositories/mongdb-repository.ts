import Meta, {IMeta} from '../persistence/Meta';

class MongdbRepository {

    async getMeta() {
        return <IMeta>await Meta.findOne();
    }
}

export default new MongdbRepository();