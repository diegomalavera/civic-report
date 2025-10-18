import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  CreateCommentRequestDto,
  CreateReportRequestDto,
  ReportDto,
  UpdateReportRequestDto,
} from 'src/dtos';
import { Permissions } from 'src/security/permissions.decorator';
import { PermissionsGuard } from 'src/security/permissions.guard';
import { ReportsService } from 'src/services/reports.service';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class ReportsController {
  private readonly logger: Logger = new Logger(ReportsController.name);

  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @Permissions('reports_read')
  findAll(): Promise<ReportDto[]> {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @Permissions('reports_read')
  findbyId(@Param('id') id: string): Promise<ReportDto> {
    return this.reportsService.findbyId(id);
  }

  @Post()
  @Permissions('reports_create')
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() createReportRequestDto: CreateReportRequestDto,
  ): Promise<ReportDto> {
    return this.reportsService.create({
      ...createReportRequestDto,
      images: images,
    });
  }

  @Put(':id')
  @Permissions('reports_update')
  update(
    @Param('id') id: string,
    @Body() updateReportRequestDto: UpdateReportRequestDto,
  ): Promise<ReportDto> {
    return this.reportsService.update(id, updateReportRequestDto);
  }

  @Post(':id/comment')
  @Permissions('reports_update')
  addComment(
    @Param('id') id: string,
    @Body() createCommentRequestDto: CreateCommentRequestDto,
  ): Promise<ReportDto> {
    return this.reportsService.addComment(id, createCommentRequestDto);
  }
}
