import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report, ReportDocument } from 'src/models/report.model';
import { AwsS3Service } from './aws-s3.service';
import { UserService } from './user.service';
import { UsersService } from './users.service';
import {
  CreateCommentRequestDto,
  CreateReportRequestDto,
  PayloadDto,
  ReportDto,
  RoleDto,
  UpdateReportRequestDto,
  UserDto,
} from 'src/dtos';
import { Messages } from 'src/messages';
import { RolesService } from './roles.service';

@Injectable()
export class ReportsService {
  private readonly logger: Logger = new Logger(ReportsService.name);

  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private readonly usersService: UsersService,
    private readonly userService: UserService,
    private readonly awsS3Service: AwsS3Service,
    private readonly rolesService: RolesService,
  ) {}

  async findAll(): Promise<ReportDto[]> {
    let reports: ReportDocument[] = [];

    const payload: PayloadDto = this.userService.getCurrentUser();

    const user: UserDto = await this.usersService.findById(payload.sub);

    const roleDtol: RoleDto = await this.rolesService.findByCode('user');

    const isUser: Boolean = user.roleIds.includes(roleDtol.id);

    if (isUser) {
      reports = await this.reportModel
        .find({ userId: new Types.ObjectId(payload.sub) })
        .exec();
    } else {
      reports = await this.reportModel.find().exec();
    }

    return ReportDto.mapReports(reports);
  }

  async findbyId(id: string): Promise<ReportDto> {
    let report: ReportDocument | null;

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(Messages.REPORT_ID_ERROR);
    }

    const payload: PayloadDto = this.userService.getCurrentUser();

    const user: UserDto = await this.usersService.findById(payload.sub);

    const roleDtol: RoleDto = await this.rolesService.findByCode('user');

    const isUser: Boolean = user.roleIds.includes(roleDtol.id);

    if (isUser) {
      report = await this.reportModel
        .findOne({
          _id: new Types.ObjectId(id),
          userId: new Types.ObjectId(payload.sub),
        })
        .exec();
    } else {
      report = await this.reportModel.findById(id).exec();
    }

    if (!report) {
      throw new NotFoundException(Messages.REPORT_NOT_FOUND);
    }

    return ReportDto.mapReport(report);
  }

  async create(
    createReportRequestDto: CreateReportRequestDto,
  ): Promise<ReportDto> {
    const currentUser: PayloadDto = this.userService.getCurrentUser();

    const images: Express.Multer.File[] = createReportRequestDto.images;

    const reportImages: { name: string; url: string }[] = [];

    for (const image of images) {
      const reportImage = await this.awsS3Service.uploadFile(image);
      reportImages.push(reportImage);
    }

    const report: ReportDocument = new this.reportModel({
      name: createReportRequestDto.name,
      description: createReportRequestDto.description,
      city: createReportRequestDto.city,
      state: createReportRequestDto.state,
      country: createReportRequestDto.country,
      address: createReportRequestDto.address,
      latitude: createReportRequestDto.latitude,
      longitude: createReportRequestDto.longitude,
      images: reportImages,
      status: 'Reportado',
      comments: [],
      userId: new Types.ObjectId(currentUser.sub),
    });

    report.save();

    return ReportDto.mapReport(report);
  }

  async update(
    id: string,
    updateReportRequestDto: UpdateReportRequestDto,
  ): Promise<ReportDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(Messages.REPORT_ID_ERROR);
    }

    const report = await this.reportModel.findById(id).exec();

    if (!report) {
      throw new NotFoundException(Messages.REPORT_NOT_FOUND);
    }

    report.status = updateReportRequestDto.status;

    report.updatedAt = new Date();

    report.save();

    return ReportDto.mapReport(report);
  }

  async addComment(
    id: string,
    createCommentRequestDto: CreateCommentRequestDto,
  ): Promise<ReportDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(Messages.REPORT_ID_ERROR);
    }

    const report = await this.reportModel.findById(id).exec();

    if (!report) {
      throw new NotFoundException(Messages.REPORT_NOT_FOUND);
    }

    const payload: PayloadDto = this.userService.getCurrentUser();

    const user: UserDto = await this.usersService.findById(payload.sub);

    const comments: { author: string; message: string; createdAt: Date }[] =
      report.comments || [];

    comments.push({
      author: user.fullName,
      message: createCommentRequestDto.message,
      createdAt: new Date(),
    });

    report.updatedAt = new Date();

    report.save();

    return ReportDto.mapReport(report);
  }
}
