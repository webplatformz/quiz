import Meta, {IMeta} from '../persistance/Meta';

class MongdbRepository {

    async getMeta() {
        return <IMeta>await Meta.findOne();
    }
}

export default new MongdbRepository();