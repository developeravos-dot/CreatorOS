import {
  NotFoundException,
} from '@nestjs/common';

import {
  AiOrganizationPersistenceService,
} from './ai-organization-persistence.service';

describe(
  'AiOrganizationPersistenceService',
  () => {
    const repository = {
      list: jest.fn(),
      findByWorkspaceKey: jest.fn(),
      save: jest.fn(),
      deleteByWorkspaceKey: jest.fn(),
    };

    const service =
      new AiOrganizationPersistenceService(
        repository as never,
      );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns persistent health metadata', () => {
      expect(service.getHealth()).toEqual({
        status: 'operational',
        storage: 'postgresql',
        orm: 'prisma',
        humanFinalAuthority: true,
        persistent: true,
      });
    });

    it('returns null for a missing optional workspace', async () => {
      repository.findByWorkspaceKey.mockResolvedValue(
        null,
      );

      await expect(
        service.getOptional('default'),
      ).resolves.toBeNull();
    });

    it('throws when deleting a missing workspace', async () => {
      repository.findByWorkspaceKey.mockResolvedValue(
        null,
      );

      await expect(
        service.delete('missing'),
      ).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  },
);
