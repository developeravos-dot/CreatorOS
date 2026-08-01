import { Injectable } from '@nestjs/common';
import { CreativeIntelligenceProgram } from '../creative-intelligence.types';

@Injectable()
export class CreativeQualityIntelligenceService {
  evaluate(program: CreativeIntelligenceProgram) {
    const scores = {
      story: program.story.acts.length >= 3 ? 95 : 60,
      script: program.script.scenes.length >= 6 ? 93 : 65,
      character: program.characters.length >= 3 ? 92 : 60,
      world: program.world.locations.length >= 3 ? 91 : 65,
      visualStyle: program.visualStyle.palette.length >= 4 ? 94 : 70,
      camera: program.camera.shots.length === program.script.scenes.length ? 96 : 60,
      lighting: program.lighting.scenes.length === program.script.scenes.length ? 95 : 60,
      audio: program.audio.scenes.length === program.script.scenes.length ? 94 : 60,
      music: program.music.sceneCues.length === program.script.scenes.length ? 93 : 60,
      voice: program.voice.characters.length === program.characters.length ? 95 : 60,
      editing: program.editing.sceneCuts.length === program.script.scenes.length ? 96 : 60,
      thumbnail: program.thumbnail.concepts.length >= 3 ? 92 : 65,
      localization: program.script.languageVersions.length >= 1 ? 90 : 50,
      governance: program.governance.humanApproved ? 100 : 70,
    };

    const failures = Object.entries(scores)
      .filter(([, score]) => score < 80)
      .map(([name]) => `${name}-below-threshold`);

    return {
      scores,
      failures,
      approved: failures.length === 0 && program.governance.humanApproved,
    };
  }
}