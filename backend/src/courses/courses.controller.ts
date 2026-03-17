import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { ListCoursesDto } from './dto/list-courses.dto';

@ApiTags('courses')
@Controller({ path: 'courses', version: '1' })
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Get()
  findAll(@Query() dto: ListCoursesDto) {
    return this.service.findAll(dto);
  }

  @Get('featured')
  findFeatured() {
    return this.service.findFeatured();
  }

  @ApiParam({ name: 'slug', type: String })
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const course = await this.service.findBySlug(slug);
    if (!course) throw new NotFoundException(`Course '${slug}' not found`);
    return course;
  }
}
