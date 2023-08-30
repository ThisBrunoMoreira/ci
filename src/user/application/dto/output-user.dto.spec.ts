import { UserEntity } from '../../domain/entities/user.entity';
import { UserDataBuilder } from '../../domain/testing/helpers/user-data-builder';
import { UserOutputMapper } from './output-user.dto';

describe('UserOutputMapper unit test', () => {
  describe('toOutput method', () => {
    it('should correctly convert a UserEntity to output format', () => {
      const userEntity = new UserEntity(UserDataBuilder({}));
      const spyToJson = jest.spyOn(userEntity, 'toJSON');

      const output = UserOutputMapper.toOutput(userEntity);

      expect(spyToJson).toHaveBeenCalled();
      expect(output).toStrictEqual(userEntity.toJSON());
    });
  });
});
