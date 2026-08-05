import { Component, Input } from '@angular/core';

export type IconName =
  | 'mountain'
  | 'map'
  | 'code'
  | 'cloud'
  | 'book'
  | 'briefcase'
  | 'user'
  | 'mail'
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'arrow-right'
  | 'external'
  | 'calendar'
  | 'clock'
  | 'tag'
  | 'spark'
  | 'layers'
  | 'database'
  | 'compass'
  | 'camera'
  | 'trek'
  | 'waves'
  | 'chevron-down'
  | 'play';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  @Input({ required: true }) name!: IconName;
  @Input() className = 'h-5 w-5';
}
