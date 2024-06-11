import {
  ColumnNode,
  ColumnUpdateNode,
  KyselyPlugin,
  PluginTransformQueryArgs,
  PluginTransformResultArgs,
  QueryResult,
  RootOperationNode,
  UnknownRow,
  UpdateQueryNode,
  ValueNode,
} from 'kysely';

export class UpdatedAtPlugin implements KyselyPlugin {
  constructor(private readonly column: string) {}

  public transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    if (!this.shouldSetUpdatedAt(args.node)) {
      return args.node;
    }

    const updatedAtFieldUpdateNode = ColumnUpdateNode.create(
      ColumnNode.create(this.column),
      ValueNode.create(Date.now()),
    );
    return UpdateQueryNode.cloneWithUpdates(args.node as UpdateQueryNode, [
      updatedAtFieldUpdateNode,
    ]);
  }

  // noop
  public async transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>> {
    return args.result;
  }

  private shouldSetUpdatedAt(node: RootOperationNode): boolean {
    if (!UpdateQueryNode.is(node)) {
      return false;
    }

    if ((node.updates ?? []).some((node) => node.column.column.name === this.column)) {
      return false;
    }

    return true;
  }
}
