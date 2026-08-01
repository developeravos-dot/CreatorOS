import { AudioIntelligenceService } from './audio/audio-intelligence.service';
import { CameraIntelligenceService } from './camera/camera-intelligence.service';
import { CharacterIntelligenceService } from './character/character-intelligence.service';
import { CreativeIntelligenceOrchestratorService } from './creative-intelligence-orchestrator.service';
import { EditingIntelligenceService } from './editing/editing-intelligence.service';
import { LightingIntelligenceService } from './lighting/lighting-intelligence.service';
import { MusicIntelligenceService } from './music/music-intelligence.service';
import { CreativeQualityIntelligenceService } from './quality/creative-quality-intelligence.service';
import { ScriptIntelligenceService } from './script/script-intelligence.service';
import { StoryIntelligenceService } from './story/story-intelligence.service';
import { ThumbnailIntelligenceService } from './thumbnail/thumbnail-intelligence.service';
import { VisualStyleIntelligenceService } from './visual/visual-style-intelligence.service';
import { VoiceIntelligenceService } from './voice/voice-intelligence.service';
import { WorldBuildingIntelligenceService } from './world/world-building-intelligence.service';

describe('AVOS Creative Intelligence Mega Pack', () => {
  function service() {
    return new CreativeIntelligenceOrchestratorService(
      new StoryIntelligenceService(),
      new ScriptIntelligenceService(),
      new CharacterIntelligenceService(),
      new WorldBuildingIntelligenceService(),
      new VisualStyleIntelligenceService(),
      new CameraIntelligenceService(),
      new LightingIntelligenceService(),
      new AudioIntelligenceService(),
      new MusicIntelligenceService(),
      new VoiceIntelligenceService(),
      new EditingIntelligenceService(),
      new ThumbnailIntelligenceService(),
      new CreativeQualityIntelligenceService(),
    );
  }

  it('builds all twelve creative intelligence systems', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Future Civilizations',
      concept: 'Humanity builds a new intelligent civilization.',
      contentType: 'cinematic documentary',
      audience: 'global premium technology audience',
      ageGroup: '18+',
      platform: 'YouTube',
      durationSeconds: 600,
      languages: ['Arabic', 'English'],
      cultures: ['GCC', 'Global'],
      tone: 'premium cinematic',
      genre: 'future technology documentary',
      budget: 50000,
    });

    expect(program.story.acts.length).toBeGreaterThanOrEqual(3);
    expect(program.script.scenes.length).toBeGreaterThanOrEqual(20);
    expect(program.characters.length).toBeGreaterThanOrEqual(3);
    expect(program.world.locations.length).toBeGreaterThanOrEqual(3);
    expect(program.visualStyle.palette.length).toBeGreaterThanOrEqual(4);
    expect(program.camera.shots.length).toBe(program.script.scenes.length);
    expect(program.lighting.scenes.length).toBe(program.script.scenes.length);
    expect(program.audio.scenes.length).toBe(program.script.scenes.length);
    expect(program.music.sceneCues.length).toBe(program.script.scenes.length);
    expect(program.voice.characters.length).toBe(program.characters.length);
    expect(program.editing.sceneCuts.length).toBe(program.script.scenes.length);
    expect(program.thumbnail.concepts.length).toBeGreaterThanOrEqual(3);
  });

  it('requires human approval before activation', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Human Authority Test',
      concept: 'Test governance.',
      contentType: 'cinematic',
      audience: 'global',
      ageGroup: '18+',
      platform: 'YouTube',
    });

    expect(() => orchestrator.activate(program.id, 'AI Director')).toThrow();

    orchestrator.approve(program.id, 'Khalifa');
    orchestrator.activate(program.id, 'Khalifa');

    expect(program.status).toBe('active');
    expect(program.quality.approved).toBe(true);
  });

  it('completes an approved active program', () => {
    const orchestrator = service();
    const program = orchestrator.create({
      title: 'Completion Test',
      concept: 'Test full lifecycle.',
      contentType: 'animation',
      audience: 'children',
      ageGroup: '8-12',
      platform: 'YouTube',
      languages: ['Arabic', 'English'],
    });

    orchestrator.approve(program.id, 'Khalifa');
    orchestrator.activate(program.id, 'Khalifa');
    orchestrator.complete(program.id, 'Khalifa');

    expect(program.status).toBe('completed');
  });

  it('produces dashboard totals', () => {
    const orchestrator = service();

    orchestrator.create({
      title: 'Dashboard Test',
      concept: 'Test dashboard.',
      contentType: 'documentary',
      audience: 'global',
      ageGroup: '18+',
      platform: 'YouTube',
    });

    const dashboard = orchestrator.dashboard();

    expect(dashboard.totals.programs).toBe(1);
    expect(dashboard.totals.scenes).toBeGreaterThanOrEqual(6);
    expect(dashboard.capabilities.systems).toHaveLength(12);
  });
});